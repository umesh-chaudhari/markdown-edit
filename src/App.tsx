import React, {useState, useEffect} from 'react';
import {marked} from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { Download, Moon, Sun, FileText, Settings, Info, X} from 'lucide-react';

marked.setOptions({
    highlight: function (code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, {language: lang}).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
});

interface ModalProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmModal: React.FC<ModalProps> = ({title, message, confirmText, cancelText, onConfirm, onCancel, isOpen}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-blend-color-dodge bg-opacity-50 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 z-10 border border-blue-200">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    >
                        <X size={20}/>
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">{message}</p>
                </div>
                <div className="p-4 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MarkdownEditor: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('# Welcome to Markdown Editor\n\nStart typing here...');
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [wordCount, setWordCount] = useState<number>(0);
    const [charCount, setCharCount] = useState<number>(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [exportOptions, setExportOptions] = useState<string>('PDF');

    useEffect(() => {
        setCharCount(markdown.length);
        setWordCount(markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length);
    }, [markdown]);

    useEffect(() => {
        const savedMarkdown = localStorage.getItem('markdown-content');
        if (savedMarkdown) {
            setMarkdown(savedMarkdown);
        }

        const darkModeSetting = localStorage.getItem('dark-mode') === 'true';
        setDarkMode(darkModeSetting);

        if (darkModeSetting) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, []);

    useEffect(() => {
        const saveContent = setTimeout(() => {
            localStorage.setItem('markdown-content', markdown);
        }, 1000);

        return () => clearTimeout(saveContent);
    }, [markdown]);

    useEffect(() => {
        localStorage.setItem('dark-mode', darkMode.toString());
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(e.target.value);
    };

    const exportHtml = () => {
        const htmlContent = marked(markdown);
        const blob = new Blob([htmlContent], {type: 'text/pdf'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    const confirmNewDocument = () => {
        setShowModal(true);
    };

    const createNewDocument = () => {
        setMarkdown('# New Document\n\n');
        setShowModal(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <header
                className={`px-4 py-2 flex items-center justify-between border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                <div className="flex items-center">
                    <FileText className="mr-2"/>
                    <h1 className="text-xl font-bold">Markdown Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={confirmNewDocument}
                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title="New Document"
                    >
                        New
                    </button>
                    <button
                        onClick={exportHtml}
                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title="Export as HTML"
                    >
                        <Download size={20}/>
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                    </button>
                    <button
                        onClick={() => {
                            setIsSettingsOpen(!isSettingsOpen);
                            setShowHelp(false);
                        }}
                        className={`p-2 rounded hover:bg-opacity-80 ${isSettingsOpen ? 'bg-gray-300 dark:bg-gray-600' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title="Settings"
                    >
                        <Settings size={20}/>
                    </button>
                    <button
                        onClick={() => {
                            setShowHelp(!showHelp);
                            setIsSettingsOpen(false);
                        }}
                        className={`p-2 rounded hover:bg-opacity-80 ${showHelp ? 'bg-gray-300 dark:bg-gray-600' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title="Help"
                    >
                        <Info size={20}/>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col w-1/2 h-full border-r border-gray-300 dark:border-gray-700">
                    <div
                        className={`px-4 py-2 border-b text-sm font-medium ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                        Editor
                    </div>
                    <textarea
                        className={`flex-1 p-4 resize-none outline-none ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
                        value={markdown}
                        onChange={handleMarkdownChange}
                        placeholder="Type your markdown here..."
                    />
                </div>
                <div className="flex flex-col w-1/2 h-full">
                    <div
                        className={`px-4 py-2 border-b text-sm font-medium ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                        Preview
                    </div>
                    <div
                        className={`flex-1 p-4 overflow-auto markdown-preview ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}
                        dangerouslySetInnerHTML={{__html: marked(markdown)}}
                    />
                </div>
            </div>

            <footer
                className={`px-4 py-2 flex justify-between items-center text-sm border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                <div>
                    {wordCount} words | {charCount} characters
                </div>
                <div>
                    Auto-saved at {new Date().toLocaleTimeString()}
                </div>
            </footer>

            {isSettingsOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-blend-color-dodge bg-opacity-30 backdrop-blur-sm z-20"
                        onClick={() => setIsSettingsOpen(false)}
                    ></div>

                    <div
                        className={`fixed right-4 top-16 w-64 p-4 shadow-lg rounded-lg z-30 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Settings</h3>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={16}/>
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center justify-between">
                                <span>Dark Mode</span>
                                <div className="relative inline-block w-10 h-5 rounded-full cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="opacity-0 w-0 h-0"
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                    />
                                    <span
                                        className={`absolute inset-0 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    ></span>
                                    <span
                                        className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'transform translate-x-5' : ''}`}
                                    ></span>
                                </div>
                            </label>
                            <label className="flex items-center justify-between">
                                <span>Auto Save</span>
                                <div
                                    className="relative inline-block w-10 h-5 rounded-full cursor-not-allowed opacity-70">
                                    <input
                                        type="checkbox"
                                        className="opacity-0 w-0 h-0"
                                        checked={true}
                                        disabled
                                    />
                                    <span className="absolute inset-0 rounded-full bg-blue-600"></span>
                                    <span
                                        className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transform translate-x-5"></span>
                                </div>
                            </label>
                            <div className="flex items-center justify-between">
                                <span>Font Size</span>
                                <select
                                    className={`p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    <option>Small</option>
                                    <option selected>Medium</option>
                                    <option>Large</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showHelp && (
                <>
                    <div
                        className="fixed inset-0 bg-blend-color-dodge bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={() => setShowHelp(false)}
                    ></div>

                    <div
                        className={`fixed inset-0 m-auto w-2/3 h-3/4 p-6 shadow-lg rounded-lg z-50 overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Markdown Help</h2>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <X size={24}/>
                            </button>
                        </div>
                        <div className="overflow-auto flex-1">
                            <h3 className="font-bold mb-2">Basic Syntax</h3>
                            <table
                                className={`w-full border-collapse mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <thead>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <th className="text-left p-2 border">Element</th>
                                    <th className="text-left p-2 border">Markdown Syntax</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Heading</td>
                                    <td className="p-2 border"># H1<br/>## H2<br/>### H3</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Bold</td>
                                    <td className="p-2 border">**bold text**</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Italic</td>
                                    <td className="p-2 border">*italicized text*</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Blockquote</td>
                                    <td className="p-2 border">{'>'} blockquote</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Ordered List</td>
                                    <td className="p-2 border">1. First item<br/>2. Second item</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Unordered List</td>
                                    <td className="p-2 border">- First item<br/>- Second item</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Code</td>
                                    <td className="p-2 border">`code`</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Link</td>
                                    <td className="p-2 border">[title](https://www.example.com)</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Image</td>
                                    <td className="p-2 border">![alt text](image.jpg)</td>
                                </tr>
                                </tbody>
                            </table>

                            <h3 className="font-bold mb-2">Extended Syntax</h3>
                            <table className={`w-full border-collapse ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <thead>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <th className="text-left p-2 border">Element</th>
                                    <th className="text-left p-2 border">Markdown Syntax</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Table</td>
                                    <td className="p-2 border">| Header | Header |<br/>| ------ | ------ |<br/>| Cell |
                                        Cell |
                                    </td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Code Block</td>
                                    <td className="p-2 border">```<br/>code block<br/>```</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Strikethrough</td>
                                    <td className="p-2 border">~~strikethrough~~</td>
                                </tr>
                                <tr className={darkMode ? 'border-gray-600' : 'border-gray-300'}>
                                    <td className="p-2 border">Task List</td>
                                    <td className="p-2 border">- [x] Task 1<br/>- [ ] Task 2</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            <ConfirmModal
                isOpen={showModal}
                title="Create New Document"
                message="Are you sure you want to create a new document? Any unsaved changes will be lost."
                confirmText="Create New"
                cancelText="Cancel"
                onConfirm={createNewDocument}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
};

const GlobalStyles = () => {
    return (
        <style jsx="true" global="true">{`
            .markdown-preview h1 {
                font-size: 2em;
                margin-bottom: 0.5em;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }

            .markdown-preview h2 {
                font-size: 1.5em;
                margin-bottom: 0.5em;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }

            .markdown-preview h3 {
                font-size: 1.25em;
                margin-bottom: 0.5em;
            }

            .markdown-preview h4 {
                font-size: 1em;
                margin-bottom: 0.5em;
            }

            .markdown-preview p {
                margin-bottom: 1em;
                line-height: 1.6;
            }

            .markdown-preview ul, .markdown-preview ol {
                margin-bottom: 1em;
                padding-left: 2em;
            }

            .markdown-preview li {
                margin-bottom: 0.5em;
            }

            .markdown-preview blockquote {
                padding: 0 1em;
                color: #6a737d;
                border-left: 0.25em solid #dfe2e5;
                margin-bottom: 1em;
            }

            .dark-mode .markdown-preview blockquote {
                border-left-color: #4a5568;
                color: #a0aec0;
            }

            .markdown-preview pre {
                background-color: #f6f8fa;
                border-radius: 3px;
                padding: 16px;
                overflow: auto;
                margin-bottom: 1em;
            }

            .dark-mode .markdown-preview pre {
                background-color: #2d3748;
            }

            .markdown-preview code {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                padding: 0.2em 0.4em;
                margin: 0;
                font-size: 85%;
                background-color: rgba(27, 31, 35, 0.05);
                border-radius: 3px;
            }

            .dark-mode .markdown-preview code {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .markdown-preview pre code {
                background-color: transparent;
                padding: 0;
            }

            .markdown-preview table {
                border-collapse: collapse;
                margin-bottom: 1em;
                width: 100%;
                overflow: auto;
            }

            .markdown-preview table th,
            .markdown-preview table td {
                padding: 6px 13px;
                border: 1px solid #dfe2e5;
            }

            .dark-mode .markdown-preview table th,
            .dark-mode .markdown-preview table td {
                border-color: #4a5568;
            }

            .markdown-preview table tr {
                background-color: #fff;
                border-top: 1px solid #c6cbd1;
            }

            .dark-mode .markdown-preview table tr {
                background-color: transparent;
                border-top-color: #4a5568;
            }

            .markdown-preview table tr:nth-child(2n) {
                background-color: #f6f8fa;
            }

            .dark-mode .markdown-preview table tr:nth-child(2n) {
                background-color: rgba(255, 255, 255, 0.05);
            }

            .markdown-preview img {
                max-width: 100%;
            }

            .markdown-preview hr {
                height: 0.25em;
                padding: 0;
                margin: 24px 0;
                background-color: #e1e4e8;
                border: 0;
            }

            .dark-mode .markdown-preview hr {
                background-color: #4a5568;
            }

            body.dark-mode {
                background-color: #1a202c;
                color: #f7fafc;
            }

            .dark-mode .markdown-preview {
                color: #f7fafc;
            }
        `}</style>
    );
};

const App: React.FC = () => {
    return (
        <>
            <GlobalStyles/>
            <MarkdownEditor/>
        </>
    );
};

export default App;