import React, { useState } from 'react';

const Aimodel = () => {
    const [highlighted, setHighlighted] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleDrop = (e) => {
        e.preventDefault();
        setHighlighted(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            console.log("Dropped file:", file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            console.log("Selected file:", file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-black flex flex-col items-center px-1 py-10">
            <h1 className="text-3xl font-bold mb-10 text-center text-slate-700">
                Upload Your File
            </h1>
            <div
                className={`border-2 border-dashed rounded-xl p-10 w-full max-w-3xl min-h-[300px]
                transition-all duration-200 shadow-md
                ${highlighted ? "bg-slate-800 border-blue-400" : "bg-slate-700 border-slate-500"}
                flex flex-col items-center justify-center text-center`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setHighlighted(true);
                }}
                onDragLeave={() => setHighlighted(false)}
                onDrop={handleDrop}
            >
                <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center text-white">
                    <svg className="w-12 h-12 mb-3 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.5"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 16v-8m0 0l-3 3m3-3l3 3m6 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m16 0a4 4 0 00-4-4H6a4 4 0 00-4 4" />
                    </svg>
                    <p className="text-lg">
                        {fileName ? (
                            <span className="text-green-400 font-semibold">{fileName}</span>
                        ) : (
                            <>
                                Drop a file here to upload,
                                <br />
                                or <span className="text-blue-400 underline">click to browse</span>
                            </>
                        )}
                    </p>
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Cards Section */}
            <div className="w-full max-w-6xl mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Summary */}
                <Card title="Summary" description="Get a concise overview of the uploaded document." />

                {/* Card 2: Key Point */}
                <Card title="Key Point" description="Extract the key highlights and focus areas." />

                {/* Card 3: Grammar */}
                <Card title="Grammar" description="Identify and correct grammar issues in your text." />
            </div>
        </div>
    );
};

// Reusable Card component
const Card = ({ title, description }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 hover:scale-[1.02] transition-transform cursor-pointer">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

export default Aimodel;
