export default function useVerticalDrag() {
  let beingDragged = false;
  let setTimeoutId;
  let initialCursorPosY;
  let cursorPosY;
  let initialScrollTop;
  let top;

  const startDragging = (e) => {
    const elem = e.currentTarget;
    cursorPosY = e.clientY;
    initialCursorPosY = cursorPosY;
    initialScrollTop = elem.offsetParent.scrollTop;
    setTimeoutId = setTimeout(() => {
      beingDragged = true;

      elem.offsetParent.draggedChild = elem;
      elem.offsetParent.addEventListener("scroll", scrollDrag);

      elem.style.position = "relative";
      top = 0;
      elem.style.top = `{top}px`;
    }, 500);
  };

  const dragging = (e) => {
    if (beingDragged) {
      const elem = e.currentTarget;

      top =
        e.clientY -
        initialCursorPosY +
        elem.offsetParent.scrollTop -
        initialScrollTop;
      cursorPosY = e.clientY;
      elem.style.top = `${top}px`;
    }
  };

  const scrollDrag = (e) => {
    if (beingDragged) {
      const elem = e.currentTarget.draggedChild;

      top =
        cursorPosY -
        initialCursorPosY +
        elem.offsetParent.scrollTop -
        initialScrollTop;
      cursorPosY = e.clientY;
      elem.style.top = `${top}px`;
    }
  };

  const stopDragging = (e) => {
    if (beingDragged) {
      beingDragged = false;

      const elem = e.currentTarget;

      elem.offsetParent.removeEventListener("scroll", scrollDrag);

      const parentTopBorderWidth = parseInt(
        getComputedStyle(elem.offsetParent, null).getPropertyValue(
          "border-top-width"
        ),
        10
      );
      const elementTopBorderWidth = parseInt(
        getComputedStyle(elem, null).getPropertyValue("border-top-width"),
        10
      );

      const newPosY =
        e.clientY -
        e.offsetY -
        elem.offsetParent.getBoundingClientRect().top +
        elem.offsetParent.scrollTop -
        parentTopBorderWidth -
        elementTopBorderWidth;

      elem.moveItem(elem.itemOrder, newPosY);
    } else {
      clearTimeout(setTimeoutId);
    }
  };

  return [
    (elem) => {
      elem.addEventListener("mousedown", startDragging);
      elem.addEventListener("mousemove", dragging);
      elem.addEventListener("mouseup", stopDragging);
      elem.addEventListener("mouseleave", stopDragging);
    },
    (elem) => {
      elem.removeEventListener("mousedown", startDragging);
      elem.removeEventListener("mousemove", dragging);
      elem.removeEventListener("mouseup", stopDragging);
      elem.removeEventListener("mouseleave", stopDragging);
    },
  ];
}
