export function divElement(parent, css = "", innerHtml = "") {
    const div = document.createElement("div");
    if (css)
        div.className = css;
    if (innerHtml)
        div.innerHTML = innerHtml;
    parent.appendChild(div);
    return div;
}
export function inputElement(parent, type = "", value, css = "", placeholder = "", step = "") {
    const input = document.createElement("input");
    if (type)
        input.type = type;
    input.value = value;
    if (css)
        input.className = css;
    if (placeholder)
        input.placeholder = placeholder;
    if (step)
        input.step = step;
    parent.appendChild(input);
    return input;
}
export function imageElement(parent, src = "", css = "", alt = "", title = "") {
    const image = document.createElement("img");
    if (src)
        image.src = src;
    if (css)
        image.className = css;
    if (alt)
        image.alt = alt;
    if (title)
        image.title = title;
    parent.appendChild(image);
    return image;
}
//# sourceMappingURL=Elements.js.map