use crate::bindings::{create_editor, create_tutorial, EditorView};
use implicit_clone::{unsync::IString, ImplicitClone};
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorEditorProps {
    pub doc: IString,
    pub onupdate: Callback<EditorView>,
    #[prop_or_default]
    pub onupdating: Option<Callback<()>>,
}

#[function_component]
pub fn CodeMirrorEditor(props: &CodeMirrorEditorProps) -> Html {
    let doc = props.doc.clone();
    let onupdate = props.onupdate.clone();
    let onupdating = props.onupdating.clone();
    let imp = Imp::Editor(doc, onupdate, onupdating);
    html! { <CodeMirrorImp {imp} /> }
}

#[derive(Properties, Clone, ImplicitClone, PartialEq)]
pub struct CodeMirrorTutorialProps {
    pub doc: &'static str,
}

#[function_component]
pub fn CodeMirrorTutorial(props: &CodeMirrorTutorialProps) -> Html {
    let imp = Imp::Tutorial(props.doc);
    html! { <CodeMirrorImp {imp} /> }
}

#[derive(Properties, PartialEq)]
struct CodeMirrorImpProps {
    imp: Imp,
}

#[derive(Clone, ImplicitClone, PartialEq)]
pub enum Imp {
    Editor(IString, Callback<EditorView>, Option<Callback<()>>),
    Tutorial(&'static str),
}

#[function_component]
fn CodeMirrorImp(props: &CodeMirrorImpProps) -> Html {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref, props.imp.clone()),
        |(node_ref, editor_ref, imp)| {
            let mut editor_ref = editor_ref.borrow_mut();

            if editor_ref.is_none() {
                let parent = node_ref.cast::<HtmlElement>().unwrap();
                let editor = imp.init(parent);

                editor_ref.replace(editor);
            }
        },
    );

    html! {
        <div class="codemirror" ref={node_ref} />
    }
}

impl Imp {
    fn init(&self, parent: HtmlElement) -> EditorView {
        match self {
            Self::Editor(doc, onupdate, onupdating) => {
                let onupdate = onupdate.clone();
                let onupdate =
                    Closure::<dyn Fn(EditorView)>::wrap(Box::new(move |v| onupdate.emit(v)));

                let onupdating = onupdating.clone();
                let onupdating =
                    onupdating.map(|f| Closure::<dyn Fn()>::wrap(Box::new(move || f.emit(()))));

                let view = create_editor(doc, parent, &onupdate, onupdating.as_ref());

                // This is a long-lived closure passed into JS, don't deallocate it.
                onupdate.forget();
                if let Some(f) = onupdating {
                    f.forget()
                }
                view
            }
            Self::Tutorial(doc) => create_tutorial(doc, parent),
        }
    }
}
