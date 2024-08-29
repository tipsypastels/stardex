use super::CodeMirror;
use crate::bindings::create_tutorial;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorTutorialProps {
    pub doc: &'static str,
}

#[function_component]
pub fn CodeMirrorTutorial(props: &CodeMirrorTutorialProps) -> Html {
    let doc = props.doc;
    let init = Callback::from(|parent| create_tutorial(doc, parent));
    html! { <CodeMirror {init} /> }
}
