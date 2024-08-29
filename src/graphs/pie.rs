use crate::collections::MyArray;
use implicit_clone::{unsync::IString, ImplicitClone};
use std::f64::consts::PI;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct PieProps {
    pub slices: MyArray<PieSlice>,
    #[prop_or(300)]
    pub diameter: u32,
    #[prop_or(true)]
    pub donut: bool,
}

#[function_component]
pub fn Pie(props: &PieProps) -> Html {
    let diameter = props.diameter;
    let slices = use_memo(props.slices.clone(), |s| {
        s.iter().fold(MyArray::new(), fold_slice)
    });

    html! {
        <svg class="pie" viewBox="-1 -1 2 2" style={format!("height: {diameter}px;")}>
            {for slices.iter().map(|slice| html! {
                <path data-name={slice.slice.name} class="pie__slice" d={slice.d} style={rgb_to_hsl_vars(&slice.slice.color)} />
            })}

            if props.donut {
                <circle r={0.6} cx={0} cy={0} fill="white" />
            }
        </svg>
    }
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct PieSlice {
    pub ratio: f64,
    pub name: IString,
    pub color: IString,
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct PieSliceComputed {
    slice: PieSlice,
    inc_ratio: f64,
    d: IString,
}

fn fold_slice(array: MyArray<PieSliceComputed>, slice: PieSlice) -> MyArray<PieSliceComputed> {
    let prev = array.last();
    let prev_inc_ratio = prev.map(|p| p.inc_ratio).unwrap_or(0.0);
    let (start_x, start_y) = coords(prev_inc_ratio);

    let inc_ratio = prev_inc_ratio + slice.ratio;
    let (end_x, end_y) = coords(inc_ratio);

    gloo::console::log!(
        slice.name.as_str(),
        slice.ratio,
        prev_inc_ratio,
        inc_ratio,
        start_x,
        start_y,
        end_x,
        end_y
    );

    let large = if slice.ratio > 0.5 { 1 } else { 0 };
    let d = format!("M {start_x} {start_y} A 1 1 0 {large} 1 {end_x} {end_y} L 0 0").into();

    array.push(PieSliceComputed {
        slice,
        inc_ratio,
        d,
    })
}

fn coords(ratio: f64) -> (f64, f64) {
    let x = (2.0 * PI * ratio).cos();
    let y = (2.0 * PI * ratio).sin();
    (x, y)
}

fn rgb_to_hsl_vars(rgb: &str) -> IString {
    let color = csscolorparser::parse(rgb).expect("invalid css color");
    let [h, s, l, _] = color.to_hsla();
    let s = s * 100.0;
    let l = l * 100.0;
    format!("--h: {h}; --s: {s}%; --l: {l}%;").into()
}
