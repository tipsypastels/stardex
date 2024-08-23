use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;

#[wasm_bindgen(module = "/js/dist/index.js")]
extern "C" {
    #[derive(PartialEq)]
    pub type EditorView;

    #[wasm_bindgen(js_name = createEditor)]
    pub fn create_editor(doc: &str, parent: HtmlElement, readonly: bool) -> EditorView;
}
