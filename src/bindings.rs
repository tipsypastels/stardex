use implicit_clone::ImplicitClone;
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;

#[wasm_bindgen(module = "/js/dist/index.js")]
extern "C" {
    #[must_use]
    #[derive(Debug, Clone, ImplicitClone, PartialEq)]
    pub type EditorView;

    #[wasm_bindgen(js_name = createEditor)]
    pub fn create_editor(
        doc: &str,
        parent: HtmlElement,
        onupdate: &Closure<dyn Fn()>,
    ) -> EditorView;

    #[wasm_bindgen(js_name = createTutorial)]
    pub fn create_tutorial(doc: &str, parent: HtmlElement) -> EditorView;

    #[wasm_bindgen(js_name = walkEditor)]
    pub fn walk_editor(view: &EditorView, f: &dyn Fn(String));
}
