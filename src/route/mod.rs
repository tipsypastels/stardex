use html::ImplicitClone;
use yew::prelude::*;
use yew_router::prelude::*;

mod compare;
mod help;
mod home;
mod settings;

#[derive(Clone, ImplicitClone, PartialEq, Routable)]
pub enum Route {
    #[at("/")]
    Home,
    #[at("/help")]
    Help,
    #[at("/compare")]
    Compare,
    #[at("/settings")]
    Settings,
}

impl Route {
    pub fn name(&self) -> &'static str {
        match self {
            Self::Home => "Home",
            Self::Help => "Help",
            Self::Compare => "Compare",
            Self::Settings => "Settings",
        }
    }

    pub fn icon(&self) -> &'static str {
        match self {
            Self::Home => "fas fa-house",
            Self::Help => "fas fa-location-question",
            Self::Compare => "fas fa-code-compare",
            Self::Settings => "fas fa-gears",
        }
    }
}

fn switch(route: Route) -> Html {
    match route {
        Route::Home => html! { <home::Home /> },
        Route::Help => html! { <help::Help /> },
        Route::Compare => html! { <compare::Compare /> },
        Route::Settings => html! { <settings::Settings /> },
    }
}

#[function_component(Router)]
pub fn router() -> Html {
    html! {
        <div class="router">
            <BrowserRouter>
                <Switch<Route> render={switch} />
            </BrowserRouter>
        </div>
    }
}
