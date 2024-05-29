function init() {
    const tab = getQueryParam("tab") || "country";
    changeTab(tab);

    let x = parseInt(getQueryParam("posx"));
    let y = parseInt(getQueryParam("posy"));
    if (isNaN(x)) {
        x = 0;
        updateQueryParam("posx", x);
    }
    if (isNaN(y)) {
        y = 0;
        updateQueryParam("posy", y);
    }
    setPosition(x, y);

    setupDraggable();
}

function getQueryParam(name) {
    let url = new URL(location.href);
    return url.searchParams.get(name);
}
function updateQueryParam(name, value) {
    let url = new URL(location.href);
    url.searchParams.set(name, value.toString());
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams}`);
}

function changeTab(tabName) {
    if (typeof (tabName) != "string") {
        return;
    }

    updateQueryParam("tab", tabName);

    for (let tab of document.querySelectorAll(".tab")) {
        if (tab.getAttribute("name") == tabName) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    }
    for (let pane of document.querySelectorAll(".pane")) {
        if (pane.getAttribute("name") == tabName) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    }
}

function setPosition(x, y) {
    const container = document.querySelector(".container");
    container.style.left = x + "px";
    container.style.top = y + "px";
}

const MOVE_UPDATE_DELAY = 100;
let TIME_LAST_MOVE = 0;

function updatePositionQueryParams(x, y) {
    TIME_LAST_MOVE = Date.now();
    setTimeout(() => {
        if (Date.now() - TIME_LAST_MOVE < MOVE_UPDATE_DELAY) {
            return;
        }
        updateQueryParam("posx", x);
        updateQueryParam("posy", y);
    }, MOVE_UPDATE_DELAY);
}

function setupDraggable() {
    const container = document.querySelector(".container");
    const dragHandle = container.querySelector(".drag-handle");

    dragHandle.addEventListener("mousedown", function(event) {
        const cursorOffsetX = event.clientX - container.getBoundingClientRect().left;
        const cusorOffsetY = event.clientY - container.getBoundingClientRect().top;

        const tabHeight = document.querySelector(".tabs").offsetHeight;
        const tabHeightExtra = 7;

        const maxX = document.documentElement.clientWidth - container.offsetWidth;
        const maxY = document.documentElement.clientHeight - tabHeight - tabHeightExtra;

        function mouseMove(event) {
            let x = event.pageX - cursorOffsetX;
            let y = event.pageY - cusorOffsetY;

            x = Math.min(Math.max(x, 0), maxX);
            y = Math.min(Math.max(y, 0), maxY);

            setPosition(x, y);
            updatePositionQueryParams(x, y);
        }

        document.addEventListener("mousemove", mouseMove);

        document.addEventListener("mouseup", function() {
            document.removeEventListener("mousemove", mouseMove);
        }, { once: true });

    });

    dragHandle.ondragstart = function() {
        return false;
    };
}

