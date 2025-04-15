import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2pdf from "html2pdf.js";
import Quill from "quill";
import { useAccessCard } from "../Globalvariable/Accessprovider";
import { getToken, isLoggedIn } from "../Localstorage";
import { useNavigate, useParams } from "react-router-dom";
import { fetchContent, updateContent,setContent} from "../Services/Editor";

// Configure allowed sizes for Quill
const Size = Quill.import("formats/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);

// Quill toolbar configuration
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
  // Holds the HTML content for PDF generation
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Programming",
  });

  const { roomId } = useParams();
  const jwt = getToken();
  const navigate = useNavigate();
  const { generatedLink } = useAccessCard();

  // Quill editor reference
  const quillRef = useRef(null);

  // WS connection state
  const [ws, setWs] = useState(null);

  // Ref to mark if the update is coming from WS
  const isSocketUpdate = useRef(false);

  // Ref to store the last accepted delta from the server/WS
  const lastAcceptedDelta = useRef(null);
  let x=0

  // Fetch initial content and set up the WebSocket connection
  useEffect(() => {
    if (!isLoggedIn()) return;

    // Fetch the initial document delta from your server
    fetchContent(roomId)
      .then((response) => {
        if (response && response.ops && quillRef.current) {
          const quill = quillRef.current.getEditor();
          quill.setContents(response); // Set the Delta
          quill.update();
          lastAcceptedDelta.current = quill.getContents();
          setFormData((prev) => ({ ...prev, content: quill.root.innerHTML }));
          console.log(response)
        }
      })
      .catch((error) => console.log(error));
    const socket = new WebSocket(`wss://0596-103-192-119-74.ngrok-free.app/ws/${roomId}/${jwt}`);
    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket delta received:", data);

        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
          // Mark this update as a WS-driven update
          isSocketUpdate.current = true;
          quill.updateContents(data); // Apply the delta from WS
          isSocketUpdate.current = false;
          // Update our last accepted state
          lastAcceptedDelta.current = quill.getContents();
          setFormData((prev) => ({ ...prev, content: quill.root.innerHTML }));
          // const length = quill.getLength(); 
          quill.focus(); 
          quill.setSelection(quill.getLength() - 1, 0);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      x++;
      if (x > 1) {
        alert("WebSocket connection lost.");
        navigate("/edit-text");
      }
    };

    return () => socket.close();
  }, [roomId, jwt, navigate]);

  // When the user makes a change:
  // 1. Send the update delta to the server.
  // 2. Immediately revert the change by restoring last accepted content,
  //    so only the WS update will actually change the editor.
  const handleQuillChange = (value, delta, source, editor) => {
    if (source === "user" && !isSocketUpdate.current) {
      console.log(JSON.stringify(lastAcceptedDelta.current))
      console.log(JSON.stringify(editor.getContents()))
      updateContent({
        prevDoc: JSON.stringify(lastAcceptedDelta.current),
        fullDoc: JSON.stringify(editor.getContents()),
        updateDoc: JSON.stringify(delta),
        uuid: roomId,
      }).catch((error) => console.log(error));
      let currentContent=JSON.stringify(editor.getContents())
      // Revert the local change; rely on WebSocket to provide the update
      if (lastAcceptedDelta.current && quillRef.current) {
        const quill = quillRef.current.getEditor();
        quill.setContents(lastAcceptedDelta.current);
      }
      /*setContent({
        fullDoc: JSON.stringify(editor.getContents()),
        updateDoc: "",
        uuid: roomId,
      }).catch((error) => console.log(error));
      console.log("content set")*/
    }
  };

  // PDF download: create a temporary element with styling and content
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

    // Extract a title from the first heading in the content for the PDF filename
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const heading = tempDiv.querySelector("h1, h2, h3, h4, h5, h6");
    let title = heading ? heading.textContent.trim() : "text-editor-content";
    title = title.replace(/[<>:"/\\|?*]+/g, "").substring(0, 50);

    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: `${title || "text-editor-content"}.pdf`,
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
