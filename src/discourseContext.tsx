import React, { useState } from "react";
import * as ReactDOM from "react-dom/client";

const discourseDiv = "discourseDiv"

async function parseQuery(pageName:string, disType:string){

  let qtype
  if (disType == "question") qtype = "evidence"
  if (disType == "evidence") qtype = "question"

  // https://stackoverflow.com/questions/19156148/i-want-to-remove-double-quotes-from-a-string
  const query = `[:find (pull ?ref [*])
    :where
      [?ref :block/properties ?prop]
      [(get ?prop :discourse_type) ?type]
	    [(= "${qtype}" ?type)]
      [?block :block/path-refs ?ref]
      [?block :block/path-refs ?qref]
      [?qref :block/name "${pageName}"]
    ]`
    console.log("parseQuery: query", query);
    try { 
      const results = await logseq.DB.datascriptQuery(query) 
      console.log("parseQuery: results", results);
      return(results)
  } catch (error) {return false}
}

export async function discourseContext() {
  //place before anything else, but after page contents
  const page:any = await logseq.Editor.getCurrentPage()
  const type = page?.properties?.discourseType //? page?.properties?.discourseType : false 
    
  if (type) {
    const pageContent = top?.document.getElementsByClassName("page-blocks-inner")[0]
    const newDiv = top?.document.createElement("div");
    newDiv?.setAttribute("id", discourseDiv);
    pageContent?.appendChild(newDiv!)
    //pageContent?.insertBefore(newDiv!, pageContent.firstElementChild)
  
    const root = ReactDOM.createRoot(top?.document.getElementById(discourseDiv)!);

    const queryResult = await parseQuery(page.name,type)

    root.render(
      <div>
         {/* @ts-ignore */}
         <DiscourseContext ptype={[type, queryResult]} />
       </div>
     )
  }
  console.log("discourseContext")
}

const DiscourseContext =  (props:any) => {

  function clickItem(index:any) {
    console.log("DB clickItem", index)
    logseq.App.pushState("page", {name: index});
  }

  const [ptype, queryResult] = props.ptype
  console.log("DB qq", queryResult)
  return (
      <div>
        <h3>Discourse Context <span>{ptype}</span></h3>
        <ul>
          {/* @ts-ignore */}
          {queryResult.map((qitem, index) => (
             <li onClick={() => clickItem(qitem[0]["original-name"])} key={index}>{qitem[0].name}</li>
                       ))}
        </ul>
    </div>
  );
}

// export default DiscourseContext;
