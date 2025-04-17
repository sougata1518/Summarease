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

  useEffect(() => {
    if (!isLoggedIn()) return;

    fetchContent(roomId)
      .then((response) => {
        if (response && response.ops && quillRef.current) {
          const quill = quillRef.current.getEditor();
          quill.setContents(response);
          quill.update();
          lastAcceptedDelta.current = quill.getContents();
          setFormData((prev) => ({
            ...prev,
            content: quill.root.innerHTML,
          }));
        }
      })
      .catch((error) => console.log(error));

    const socket = new WebSocket(`ws://localhost:8080/ws/${roomId}/${jwt}`);
    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
    
        isSocketUpdate.current = true;
        quill.updateContents(data);
        isSocketUpdate.current = false;
    
        lastAcceptedDelta.current = quill.getContents();
        setFormData((prev) => ({
          ...prev,
          content: quill.root.innerHTML,
        }));
    
        // Check if the incoming delta contains a new line insert
        const ops = data.ops || [];
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

      updateContent({
        prevDoc: JSON.stringify(lastAcceptedDelta.current),
        fullDoc: JSON.stringify(editor.getContents()),
        updateDoc: JSON.stringify(delta),
        uuid: roomId,
      }).catch((error) => console.log(error));

      if (lastAcceptedDelta.current && quill) {
        quill.setContents(lastAcceptedDelta.current);
      }
    }
  };

  const downloadPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <style>
        .ql-align-center { text-align: center; }
        .ql-align-right { text-align: right; }
        .ql-align-justify { text-align: justify; }
        .ql-size-10px { font-size: 10px; }
        .ql-size-12px { font-size: 12px; }
        .ql-size-14px { font-size: 14px; }
        .ql-size-16px { font-size: 16px; }
        .ql-size-18px { font-size: 18px; }
        .ql-size-24px { font-size: 24px; }
        .ql-size-32px { font-size: 32px; }
        body { font-family: Arial, sans-serif; }
      </style>
      ${formData.content}
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const heading = tempDiv.querySelector("h1, h2, h3, h4, h5, h6");
    let title = heading ? heading.textContent.trim() : "text-editor-content";
    title = title.replace(/[<>:"/\\|?*]+/g, "").substring(0, 50);

    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: `${title}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Text Editor</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <ReactQuill
          ref={quillRef}
          value={formData.content}
          onChange={handleQuillChange}
          modules={modules}
          theme="snow"
          placeholder="Waiting for WebSocket content..."
          className="text-editor"
          style={{ height: "300px", marginBottom: "20px" }}
        />
        <div className="button-group">
          <button type="button" className="create-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;
