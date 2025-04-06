import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2pdf from "html2pdf.js";
import Quill from "quill";

const Size = Quill.import("formats/size");
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);


// const modules = {
//   toolbar: [
//     [{ font: [] }],
//     [{ size: ["10px", "12px", "14px", "16px", "18px", "24px", "32px"] }],
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     ["bold", "italic", "underline", "strike"],
//     [{ color: [] }, { background: [] }],
//     [{ script: "sub" }, { script: "super" }],
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ indent: "-1" }, { indent: "+1" }],
//     [{ align: [] }],
//     ["link", "code-block"],
//     ["clean"],
//   ],
//   clipboard: { matchVisual: false },
// };

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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Programming",
  });

  const contentRef = useRef();

  const handleQuillChange = (value) => {
    setFormData({ ...formData, content: value });
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
  
    // 🔍 Extract the first heading (h1–h6) as the title
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.content;
    const heading = tempDiv.querySelector("h1, h2, h3, h4, h5, h6");
    let title = heading ? heading.textContent.trim() : "text-editor-content";
  
    // Sanitize filename (remove unsafe characters)
    title = title.replace(/[<>:"/\\|?*]+/g, "").substring(0, 50); // max 50 chars
  
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
          value={formData.content}
          onChange={handleQuillChange}
          modules={modules}
          theme="snow"
          placeholder="Start typing here..."
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
