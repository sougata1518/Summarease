import { saveAs } from 'file-saver';
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2pdf from "html2pdf.js";
import Quill from "quill";
import { useAccessCard } from "../Globalvariable/Accessprovider";
import { getToken, isLoggedIn } from "../Localstorage";
import { useNavigate, useParams } from "react-router-dom";
import { fetchContent, updateContent, saveVersion, fetchAllVersions, fetchVersionById, createEditor, setContent } from "../Services/Editor";

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
  const [versions, setVersions] = useState([]);

  const pendingSelection = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Programming",
  });

  const { roomId } = useParams();
  const jwt = getToken();
  const navigate = useNavigate();
  const { generatedLink, setNotification } = useAccessCard();
  const quillRef = useRef(null);
  const [ws, setWs] = useState(null);
  const isSocketUpdate = useRef(false);
  const lastAcceptedDelta = useRef(null);
  let closeAttempt = 0;
  const versionIdRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

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

    const fetchInterval = setInterval(() => {
      fetchAllVersions(roomId)
        .then((versionsData) => {
          console.log("Fetched Versions:", versionsData);
          setVersions(versionsData);
        })
        .catch((err) => showNotification("Failed to fetch versions:", "warning"));
    }, 1000)

    const socket = new WebSocket(`ws://localhost:8080/ws/${roomId}/${jwt}`);
    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setWs(socket);
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        versionIdRef.current = data.version
        const update = JSON.parse(data.updateDoc);
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        if (data.fullDocChanged === false) {


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
        } else {
          quill.setContents(JSON.parse(data.fullDoc));
          lastAcceptedDelta.current = quill.getContents();
          setFormData((prev) => ({
            ...prev,
            content: quill.root.innerHTML,
          }));

        }
      } catch (err) {
        showNotification("Failed to parse WebSocket message:", "warning");
      }
    };




    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      closeAttempt++;
      if (closeAttempt > 1) {
        showNotification("Incorrect Key", "warning")
        navigate("/edit-text");
      }
    };

    return () => {
      clearInterval(fetchInterval)
      socket.close();
    }
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

  //  Save Version
  const handleSaveVersion = async () => {
    try {
      const quill = quillRef.current.getEditor();
      const deltaJson = JSON.stringify(quill.getContents());
      await saveVersion({ deltaJson, editorId: roomId });
      showNotification("Version saved!", "warning");
      const updated = await fetchAllVersions(roomId);
      setVersions(updated);
    } catch (err) {
      console.error("Save version failed:", err);
      showNotification("Failed to save version", "warning");
    }
  };

  //  Load Version
  const handleLoadVersion = async (id) => {
    try {
      const ver = await fetchVersionById(id);
      if (ver && quillRef.current) {
        // const quill = quillRef.current.getEditor();
        setContent({
          version: versionIdRef.current,
          uuid: roomId,
          fullDoc: ver.deltaJson
        })
      }
    } catch (err) {
      console.error("Version load failed:", err);
      showNotification("Could not load version", "warning");
    }
  };

  return (
    <div className="bg-gray-100 min-h-[90vh] flex justify-center px-4 py-8 sm:py-10 md:py-12">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl flex">

        {/* Sidebar */}
        <aside className="w-56 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Versions</h3>
          <button
            onClick={handleSaveVersion}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mb-4 transition"
          >
            + Save Version
          </button>

          <div className="overflow-y-auto flex-1">
            {versions.length === 0 ? (
              <p className="text-gray-500 text-sm">No versions yet</p>
            ) : (

              versions.map((v,index) => (
                <button
                  key={v.id}
                  onClick={() => handleLoadVersion(v.id)}
                  className="w-full text-left px-3 py-2 mb-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                >
                  Version #{versions.length-index}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ✏ Main Editor */}
        <div className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-2 gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Text Editor</h2>
            <div className="flex gap-3">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
                onClick={() => {
                  navigator.clipboard.writeText(
                    generatedLink ||
                    window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
                  );
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
    </div>
  );
};

export default TextEditor;