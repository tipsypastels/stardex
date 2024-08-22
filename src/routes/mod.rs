use html::ImplicitClone;
use yew::prelude::*;
use yew_router::prelude::*;

mod compare;
mod overview;
mod settings;
mod tutorial;

#[derive(Clone, ImplicitClone, PartialEq, Routable)]
pub enum Route {
    #[at("/")]
    Overview,
    #[at("/compare")]
    Compare,
    #[at("/settings")]
    Settings,
    #[at("/tutorial")]
    Tutorial,
}

impl Route {
    pub fn name(&self) -> &'static str {
        match self {
            Self::Overview => "Overview",
            Self::Compare => "Compare",
            Self::Settings => "Settings",
            Self::Tutorial => "Tutorial",
        }
    }

    pub fn icon(&self) -> &'static str {
        match self {
            Self::Overview => "fas fa-table-columns",
            Self::Compare => "fas fa-code-compare",
            Self::Settings => "fas fa-gears",
            Self::Tutorial => "fas fa-location-question",
        }
    }
}

fn switch(route: Route) -> Html {
    match route {
        Route::Overview => html! { <overview::Overview /> },
        Route::Compare => html! { <compare::Compare /> },
        Route::Settings => html! { <settings::Settings /> },
        Route::Tutorial => html! { <tutorial::Tutorial /> },
    }
}

#[function_component]
pub fn Router() -> Html {
    html! {
        <div class="router">
            <BrowserRouter>
                <Switch<Route> render={switch} />
            </BrowserRouter>
        </div>
    }
}
