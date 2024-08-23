use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;

#[wasm_bindgen(module = "/js/dist/index.js")]
extern "C" {
    #[wasm_bindgen(js_name = editorInit)]
    pub fn editor_init(parent: HtmlElement);
}
