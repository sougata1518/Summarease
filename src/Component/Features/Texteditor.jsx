import { saveAs } from 'file-saver';
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2pdf from "html2pdf.js";
import Quill from "quill";
import { useAccessCard } from "../Globalvariable/Accessprovider";
import { getToken, isLoggedIn } from "../Localstorage";
import { useNavigate, useParams } from "react-router-dom";
import { fetchContent, updateContent } from "../Services/Editor";


// Allow custom font sizes
const Size = Quill.import("formats/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["10px", "12px", "14px", "16px", "18px", "24px", "32px"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "code-block"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const TextEditor = () => {
  const pendingSelection = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Programming",
  });

  const { roomId } = useParams();
  const jwt = getToken();
  const navigate = useNavigate();
  const { generatedLink } = useAccessCard();
  const quillRef = useRef(null);
  const [ws, setWs] = useState(null);
  const isSocketUpdate = useRef(false);
  const lastAcceptedDelta = useRef(null);
  let closeAttempt = 0;
  const versionIdRef = useRef(null);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    if (!isLoggedIn()) return;
    fetchContent(roomId)
      .then((response) => {
        let resDoc = JSON.parse(response.fullDoc);
        if (response && resDoc.ops && quillRef.current) {
          console.log(response.fullDoc, " ", response.version);
          versionIdRef.current = response.version;
          const quill = quillRef.current.getEditor();
          setTimeout(() => {
            quill.setContents(resDoc);
            quill.update();
            lastAcceptedDelta.current = quill.getContents();
            setFormData((prev) => ({
              ...prev,
              content: quill.root.innerHTML,
            }));
          }, 0);
        }
      })
      .catch((error) => console.log(error)

      );

    const socket = new WebSocket(`ws://localhost:8080/ws/${roomId}/${jwt}`);
      socket.onopen = () => {
        console.log("Connected to WebSocket");
        setWs(socket);
      };
    //check
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        versionIdRef.current = data.version
        const update = JSON.parse(data.updateDoc);
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        isSocketUpdate.current = true;
        quill.updateContents(update);
        isSocketUpdate.current = false;

        lastAcceptedDelta.current = quill.getContents();
        setFormData((prev) => ({
          ...prev,
          content: quill.root.innerHTML,
        }));

        // Check if the incoming delta contains a new line insert
        const ops = update.ops || [];
        const hasNewline = ops.some(
          (op) => typeof op.insert === "string" && op.insert.includes("\n")
        );

        if (hasNewline) {
          setTimeout(() => {
            const len = quill.getLength();
            quill.focus();
            quill.setSelection(len - 1, 0);
          }, 0);
        }
        // Restore selection if set manually from elsewhere
        if (pendingSelection.current) {
          const { index, length } = pendingSelection.current;
          const safeIndex = Math.min(index, quill.getLength() - 1);
          quill.setSelection(safeIndex, length);
          pendingSelection.current = null;
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };




    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      closeAttempt++;
      if (closeAttempt > 1) {
        alert("WebSocket connection lost.");
        navigate("/edit-text");
      }
    };

    return () => socket.close();
  }, [roomId, jwt, navigate]);

  const handleQuillChange = (value, delta, source, editor) => {
    if (source === "user" && !isSocketUpdate.current) {
      const quill = quillRef.current.getEditor();
      const currentSelection = quill.getSelection();

      if (currentSelection) {
        pendingSelection.current = currentSelection;
      }
      console.log(versionIdRef.current)
      updateContent({
        fullDoc: JSON.stringify(editor.getContents()),
        updateDoc: JSON.stringify(delta),
        version: versionIdRef.current,
        uuid: roomId,
      }).catch((error) => console.log(error));

      if (lastAcceptedDelta.current && quill) {
        quill.setContents(lastAcceptedDelta.current);
      }
    }
  };

  const downloadPDF = () => {
    const editor = document.querySelector('.ql-editor');

    const opt = {
      margin: 0.5,
      filename: 'text-editor-content.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    html2pdf()
      .from(editor)
      .set(opt)
      .outputPdf('blob')
      .then((pdfBlob) => {
        saveAs(pdfBlob, opt.filename);
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
      });
  };
  return (
    <div className="bg-gray-100 min-h-[90vh] flex justify-center px-4 py-8 sm:py-10 md:py-12">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-4 sm:p-6 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-2 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Text Editor</h2>

          <div className="flex gap-3">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => {
                navigator.clipboard.writeText(generatedLink || window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md transition cursor-pointer"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          </div>
        </div>


        <form onSubmit={(e) => e.preventDefault()}>

          <div id="editor-content">
            <ReactQuill
              ref={quillRef}
              value={formData.content}
              modules={modules}
              theme="snow"
              placeholder="Waiting for WebSocket content..."
              className="min-h-[200px] h-[300px] mb-6"
              onChange={handleQuillChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextEditor;