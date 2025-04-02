import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ font: [] }], // Font family
    [{ size: ["small", false, "large", "huge"] }], // Font size
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headings
    ["bold", "italic", "underline", "strike"], // Formatting options
    [{ color: [] }, { background: [] }], // Font color & background color
    [{ script: "sub" }, { script: "super" }], // Subscript & Superscript
    [{ list: "ordered" }, { list: "bullet" }], // Ordered & Unordered lists
    [{ indent: "-1" }, { indent: "+1" }], // Indentation
    [{ align: [] }], // Alignment
    ["link", "code-block"], // Link, Code block
    ["clean"], // Clear formatting
  ],
  clipboard: { matchVisual: false },
};

const TextEditor = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Programming",
  });

  const handleQuillChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post Submitted:", formData);
    alert("Post Created Successfully!");
  };

  const handleReset = () => {
    setFormData({ title: "", content: "", category: "Programming" });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Text Editor</h2>
      <form onSubmit={handleSubmit}>

        <ReactQuill
          value={formData.content}
          onChange={handleQuillChange}
          modules={modules}
          theme="snow"
          placeholder="Start typing here..."
          className="text-editor"
          style={{ height: "300px" }}
        />

        <div className="button-group">
          <button type="submit" className="create-btn">
            Download
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;
