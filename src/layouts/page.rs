use super::nav::Nav;
use implicit_clone::unsync::IString;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct PageProps {
    pub title: IString,
    pub children: Html,
}

#[function_component(Page)]
pub fn page(props: &PageProps) -> Html {
    html! {
        <div class="page">
            <h1 class="page__title">
                {&props.title}
            </h1>

            <Nav />

            <div class="page__content">
                {props.children.clone()}
            </div>
        </div>
    }
}
