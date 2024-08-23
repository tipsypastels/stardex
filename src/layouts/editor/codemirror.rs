use html::IntoPropValue;
use web_sys::HtmlElement;
use yew::prelude::*;

#[hook]
pub fn use_codemirror() -> CodeMirror {
    let node_ref = use_node_ref();

    use_effect_with(node_ref.clone(), |node_ref| {
        let parent = node_ref.cast::<HtmlElement>().unwrap();
        bindings::init(parent);
    });

    CodeMirror(node_ref)
}

pub struct CodeMirror(NodeRef);

impl IntoPropValue<NodeRef> for CodeMirror {
    fn into_prop_value(self) -> NodeRef {
        self.0
    }
}

mod bindings {
    use super::*;
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen(module = "/js/dist/index.js")]
    extern "C" {
        pub fn init(parent: HtmlElement);
    }
}
