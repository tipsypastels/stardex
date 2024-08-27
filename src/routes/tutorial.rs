use super::Route;
use crate::{
    codemirror::{CodeMirror, CodeMirrorMode},
    layouts::Page,
};
use yew::prelude::*;
use yew_router::hooks::use_route;

#[function_component]
pub fn Tutorial() -> Html {
    let title = if let Some(Route::Overview) = use_route() {
        "Welcome"
    } else {
        "Tutorial"
    };

    html! {
        <Page {title}>
            <p>
                {"Welcome to Stardex! You can use this tool to build balanced Pokédexes by comparing them against the type distributions present in the canonical games."}
            </p>

            <div class="tutorial-editor">
                <CodeMirror mode={CodeMirrorMode::Tutorial(DOC)} />
            </div>
        </Page>
    }
}

const DOC: &str = r#"Ducklett
Swanna

# Regional forms
Dratini (Psychic)
Dragonair (Psychic/Dragon)

# Totally custom Pokémon and type
Opaling (Fantasy)

# A Pokémon we don't like and will remove if there are too many normal types
Lickitung @filler"#;
