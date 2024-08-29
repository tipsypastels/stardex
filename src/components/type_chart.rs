use super::{Pie, PieSlice, TypeName};
use crate::{collections::MyArray, models::Allotment};
use std::rc::Rc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct TypeChartProps {
    pub allotment: Rc<Allotment>,
}

#[function_component]
pub fn TypeChart(props: &TypeChartProps) -> Html {
    let allotment = &props.allotment;
    let slices = allotment
        .iter()
        .map(|s| PieSlice {
            ratio: s.ratio,
            color: s.typ.color,
            name: s.typ.name,
        })
        .collect::<MyArray<_>>();

    html! {
        <div class="type-chart">
            <div class="type-chart__chart">
                <Pie {slices} />
            </div>

            <ul class="type-chart__legend">
                {for allotment.iter().map(|s| html! {
                    <li>
                        <TypeName typ={s.typ} />
                        {format!(" — {:.1}% ({})", 100.0 * s.ratio, s.count)}
                    </li>
                })}
            </ul>
        </div>
    }
}
