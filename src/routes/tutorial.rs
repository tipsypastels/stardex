use super::Route;
use crate::{
    codemirror::CodeMirrorTutorial,
    components::TypeChart,
    layouts::Page,
    models::{Allotment, Entry},
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
    let allotment = use_memo((), |_| Allotment::new(doc_entries()));

    html! {
        <Page {title}>
            <p>
                {"Welcome to Stardex! You can use this tool to build balanced Pokédexes by comparing them against the type distributions present in the canonical games."}
            </p>

            <p>
                {"In the textbox to the side, you can enter Pokémon names one per line. Leaving blank lines for grouping is permitted, as is commenting out lines with "}<code>{"#"}</code>{"."}
            </p>

            <p>
                {"Stardex does not know about regional forms or the various other type-changing states a Pokémon be in. Instead, to specify types that are not those of the default form, list them in parentheses after the name, separated by a slash. This can also be done for completely custom Pokémon, and custom types."}
            </p>

            <p>
                {"The attribute "}<code>{"@filler"}</code>{" placed after an entry will cause Stardex to specifically recommend removing this Pokémon if too many of its type are present. Conversely, the attribute "}<code>{"@ignore"}</code>{" will exclude a Pokémon from all counting and consideration."}
            </p>

            <div class="tutorial-editor">
                <CodeMirrorTutorial doc={DOC} />
            </div>

            <p>
                {"This example produces the following type graph."}
            </p>

            <TypeChart {allotment} />
        </Page>
    }
}

const DOC: &str = r#"Ducklett
Swanna

# Canonical regional forms
Vulpix (Ice)
Ninetales (Ice/Fairy)

# My custom regional forms
Dratini (Psychic)
Dragonair (Psychic/Dragon)

# Totally custom Pokémon and type
Opaling (Fantasy)

# A Pokémon we don't like and have
# included as a space filler for now
Lickitung @filler"#;

fn doc_entries() -> Vec<Entry> {
    fn entry(n: &str, t: Option<&[&str]>, a: &[&str]) -> Entry {
        Entry::new(
            n.into(),
            t.map(|t| t.iter().map(ToString::to_string).collect()),
            a.iter().map(ToString::to_string).collect(),
        )
        .unwrap_or_else(|_| panic!("invalid tutorial entry {n}"))
    }

    vec![
        entry("Ducklett", None, &[]),
        entry("Swanna", None, &[]),
        entry("Vulpix", Some(&["Ice"]), &[]),
        entry("Ninetales", Some(&["Ice", "Fairy"]), &[]),
        entry("Dratini", Some(&["Psychic"]), &[]),
        entry("Dragonair", Some(&["Psychic", "Dragon"]), &[]),
        entry("Opaling", Some(&["Fantasy"]), &[]),
        entry("Lickitung", None, &["@filler"]),
    ]
}
