const foreground_entry_point = document.createElement("div");
let reactJS_script = document.createElement("script");
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://tailwindcss.com/_next/static/css/a047d627638f9b33.css";

foreground_entry_point.id = "foreground";
reactJS_script.src = "foreground.bundle.js";

foreground_entry_point.appendChild(reactJS_script);

document.querySelector("head").appendChild(link);
document.querySelector("body").appendChild(foreground_entry_point);
