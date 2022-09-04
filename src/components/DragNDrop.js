import React, { useState, useRef, useEffect } from "react";

function DragNDrop({ data }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);
  const [input, setinput] = useState("")
  const [check,setCheck]=useState("");
  const [scheck, setsCheck] = useState("");
  const [search, setsearch] = useState("");


  useEffect(() => {
    setList(data);
  }, [setList, data]);

  const dragItem = useRef();
  const dragItemNode = useRef();

  const handletDragStart = (e, item) => {
  
    console.log("Starting to drag", item);

    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener("dragend", handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };
  
  const handleDragEnter = (e, targetItem) => {
      
    console.log("Entering a drag target", targetItem);
  
    if (dragItemNode.current !== e.target) {
         
      console.log("Target is NOT the same as dragged item");
      setList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[dragItem.current.grpI].items.splice(
            dragItem.current.itemI,
            1
          )[0]
        );
        dragItem.current = targetItem;
        localStorage.setItem("List", JSON.stringify(newList));
        return newList;
      });
      if (targetItem.grpI == 2) {
        prompt("add comment");
      }
    }
     
  };
  const handleDragEnd = (e) => {
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", handleDragEnd);
    dragItemNode.current = null;
  };
  const getStyles = (item) => {
    if (
      dragItem.current.grpI === item.grpI &&
      dragItem.current.itemI === item.itemI
    ) {
      return "dnd-item current";
    }
    return "dnd-item";
  };
console.log(input,check);

  const handleAdd=()=>{
       if (check == "Not Started") {
         setList((oldList) => {
           let newList = JSON.parse(JSON.stringify(oldList));
           newList[0].items.push(input);
           localStorage.setItem("List", JSON.stringify(newList));
           return newList;
         });
       } else if (check == "In Development") {
         setList((oldList) => {
           let newList = JSON.parse(JSON.stringify(oldList));
           newList[1].items.push(input);
           localStorage.setItem("List", JSON.stringify(newList));
           return newList;
         });
       } else if (check == "Completed") {
         setList((oldList) => {
           let newList = JSON.parse(JSON.stringify(oldList));
           newList[2].items.push(input);
           localStorage.setItem("List", JSON.stringify(newList));
           return newList;
         });
       }
       setCheck("");
       setinput("");
  }
  useEffect(()=>{
    if(input.length==0)
    {
       setCheck("");
    }
  }, [input])
  

  useEffect(()=>{
  
      if (scheck == "Not Started" && search.length>0) {
       
                  setList((oldList)=>{
                       let newList = JSON.parse(localStorage.getItem("List"));
                      var s= newList[0].items.filter((el)=>{
                           if(el.includes(search))
                           {
                               return el;
                           }
                       })
                       let obj = { title: "Not Started",items:s };
                       newList.splice(0,1,obj);

                        return newList;
                     
                  })
      }
      else if (scheck == "In Development" && search.length > 0) {
        setList((oldList) => {
          let newList = JSON.parse(localStorage.getItem("List"));
          var s = newList[1].items.filter((el) => {
            if (el.includes(search)) {
              return el;
            }
          });
          let obj = { title: "In Development", items: s };
          newList.splice(1, 1, obj);

          return newList;
        });
      } else if (scheck == "Completed" && search.length > 0) {
        setList((oldList) => {
         let newList = JSON.parse(localStorage.getItem("List"));
          var s = newList[2].items.filter((el) => {
            if (el.includes(search)) {
              return el;
            }
          });
          let obj = { title: "Completed", items: s };
          newList.splice(2, 1, obj);

          return newList;
        });
      } 
      else{
         let d=JSON.parse(localStorage.getItem("List"));
         setList(d);
      }
  },[search])

  if (list) {
    return (
      <div className="drag-n-drop">
        {list.map((grp, grpI)=>(
          <div
            key={grp.title}
            onDragEnter={
              dragging ? (e) => handleDragEnter(e, { grpI, itemI: 0 }) : null
            }
            className="dnd-group"
          >
            <div className="group-title"> {grp.title}</div>
            <div className="input-dnd">
              <div>
                <input
                  type="text"
                  value={grp.title == check ? input : ""}
                  disabled={grp.title !== check && check.length !== 0}
                  onChange={(e) => {
                    setinput(e.target.value);
                    setCheck(grp.title);
                  }}
                />
                <button onClick={handleAdd}>add</button>
              </div>
              <div>
                <label> Search:</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setTimeout(() => {
                      setsearch(e.target.value);
                    }, 500);
                    setsCheck(grp.title);
                  }}
                />
              </div>
            </div>

            {grp.items.map((item, itemI) => (
              <div
                draggable="true"
                key={item}
                onDragStart={(e) => handletDragStart(e, { grpI, itemI })}
                onDragEnter={
                  dragging && !grp.items.length
                    ? (e) => {
                        handleDragEnter(e, { grpI, itemI });
                      }
                    : ""
                }
                className={dragging ? getStyles({ grpI, itemI }) : "dnd-item"}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default DragNDrop;
