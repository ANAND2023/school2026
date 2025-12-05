import { CKEditor } from "ckeditor4-react";
import React, { useState } from "react";
import { useEffect } from "react";

const FullTextEditor = ({
  value,
  setValue,
  EditTable,
  setEditTable,
  clear,
}) => {
  const [editor, setEditor] = useState(null);

  // useEffect(() => {
  //   if (editor && editor?.status === "ready" && EditTable) {
  //     editor.setData(value ? value : "");
  //   }
  // }, [value, EditTable, editor]);

  // useEffect(() => {
  //   if (clear) {
  //     editor.setData("");
  //   }
  // }, [clear]);

  //new code after server issue 

//   useEffect(() => {
//   if (editor?.status === "ready" && EditTable) {
//     editor.setData(value || "");
//   }
// }, [value, EditTable, editor]);

function sanitizeContent(content) {
  if (!content || typeof content !== "string") return "";
  if (!/<(p|div|span)/i.test(content)) {
    return `<div>${content}</div>`;
  }
  return content;
}

useEffect(() => {
  if (editor?.status === "ready" && EditTable) {
    setTimeout(() => {
      try {
        editor.setData(sanitizeContent(value));
      } catch (e) {
        console.error("CKEditor setData failed:", e);
        editor.setData(""); // fallback to empty instead of crash
      }
    }, 0);
  }
}, [value, EditTable, editor]);



useEffect(() => {
  if (editor?.status === "ready" && clear) {
    editor.setData("");
  }
}, [clear, editor]);

useEffect(() => {
  return () => {
    if (editor) {
      editor.destroy(true);
    }
  };
}, [editor]);



  // const onInstanceReady = (evt) => {
  //   const readyEditor = evt.editor;
  //   setEditor(readyEditor);
  //   if (EditTable && value) {
  //     readyEditor.setData(value);
  //   }
  // };
  // const onInstanceReady = (evt) => {
  //   const readyEditor = evt.editor;
  //   setEditor(readyEditor);

  //   const body = readyEditor.document && readyEditor.document.getBody();
  //   if (body) {
  //     body.setStyle("font-family", "Times New Roman");
  //     body.setStyle("font-size", "18px");
  //   }

  //   if (EditTable && value) {
  //     readyEditor.setData(value);
  //   }
  // };
  const onInstanceReady = (evt) => {
  const readyEditor = evt.editor;
  setEditor(readyEditor);

  const body = readyEditor.document?.getBody();
  if (body) {
    body.setStyle("font-family", "Times New Roman");
    body.setStyle("font-size", "18px");
  }

  if (EditTable && value) {
    readyEditor.setData(sanitizeContent(value));
  }
};



  // const onChange = (evt) => {
  //   setEditTable(false);
  //   var newContent = evt?.editor?.getData();
  //   setValue(newContent);
  // };

 const onChange = (evt) => {
  setEditTable(false);
  let newContent = evt?.editor?.getData();
  const hasFont = /font-(size|family)/.test(newContent);
  const hasSpanOrStyle = /style=[^>]*font/.test(newContent);
  if (!hasFont && !hasSpanOrStyle) {
    newContent = `<div style="font-size:18px; font-family:'Times New Roman', Times, serif;">${newContent}</div>`;
  }

  setValue(newContent); // now this styled content goes to the API
};


  const editorConfig = {
    // contentsCss: ["/ckeditor-custom.css"], 
    contentsCss: ["/NewCkeditor/ckeditor/contents.css"],
    bodyClass: "editor-content",

    font_defaultLabel: "Times New Roman",
    fontSize_defaultLabel: "18px",

    table_defaultAttributes: {
      style: "width:800px",
    },
    table_defaultStyles: {
      width: "800px",
    },
    extraPlugins:
      "lineheight,tableresize,basicstyles, image2, embed, autoembed, widget,clipboard, lineutils, dialog, dialogui, scayt, notification, toolbar, resize, justify, colorbutton, find, templates, colordialog, newpage, save, print, preview, pastefromword, pagebreak, font,stylescombo,uploadimage",
    removePlugins: "forms",
//     extraPlugins: "basicstyles,image2,widget,clipboard,lineutils,dialog,dialogui,scayt,notification,toolbar,resize,justify,colorbutton,find,templates,colordialog,newpage,save,print,preview,pastefromword,pagebreak,font,stylescombo,uploadimage",
// removePlugins: "forms",
    toolbar: [
     //  { name: "insert", items: ["Table", "RowBorders"] },
      {
        name: "document",
        items: ["Source", "Save", "NewPage", "Preview", "Print", "Templates"],
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "Undo",
          "Redo",
        ],
      },
      { name: "editing", items: ["Find", "Replace", "SelectAll", "Scayt"] },
      "/",
      {
        name: "basicstyles",
        items: ["Bold", "Italic", "Underline","Subscript", "Superscript"],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "Outdent",
          "Indent",
          "Blockquote",
          "CreateDiv",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "BidiLtr",
          "BidiRtl",
          "Language",
          "lineheight",
        ],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "Embed",
         // "rowborders" ,
        ],
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "others", items: ["-"] },
    ],
    colorButton_colors:
      "000,800000,8B0000,FF0000,FFA500,FFD700,008000,00FF00,000080,0000FF,800080,FF00FF",
    colorButton_enableMore: true,
    colorButton_backColors:
      "FFFFCC,FFCC99,FF9999,99CCFF,CCFFFF,CCFFCC,FFFF99,CC99FF",
    height: 250,
    enterMode: 2,
    line_height: ".5;.75;1;1.15;1.25;1.5;1.75;2;2.5;3"
  };

  return (
    <div>
      <CKEditor
        initData={value ? value : ""}
        onChange={onChange}
        onInstanceReady={onInstanceReady}
        config={editorConfig}
      />
    </div>
  );
};

export default FullTextEditor;
