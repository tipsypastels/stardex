use crate::{
    collections::{MyArray, MySet},
    models::{Entry, Region, Strictness},
};
use implicit_clone::{unsync::IString, ImplicitClone};
use std::rc::Rc;
use yew::{ContextProvider, Reducible, UseReducerHandle};

pub type StateContext = UseReducerHandle<State>;
pub type StateContextProvider = ContextProvider<StateContext>;

#[derive(Debug, PartialEq)]
pub struct State {
    pub mobile_editor_open: bool,
    pub entries: MyArray<Entry>,
    pub regions: MySet<IString>,
    pub strictness: Strictness,
}

impl Default for State {
    fn default() -> Self {
        Self {
            mobile_editor_open: false,
            entries: MyArray::<Entry>::default(),
            regions: Region::dat_without_kanto().names().into(),
            strictness: Strictness::Normal,
        }
    }
}

#[allow(unused)]
#[derive(Debug)]
pub enum Action {
    OpenMobileEditor,
    CloseMobileEditor,
    SetStrictness(Strictness),
    EnableRegion(IString),
    DisableRegion(IString),
    SelectRegions(SelectRegions),
}

impl Reducible for State {
    type Action = Action;

    fn reduce(self: Rc<Self>, action: Action) -> Rc<Self> {
        match action {
            Action::OpenMobileEditor => Rc::new(Self {
                mobile_editor_open: true,
                entries: self.entries.clone(),
                regions: self.regions.clone(),
                strictness: self.strictness,
            }),
            Action::CloseMobileEditor => Rc::new(Self {
                mobile_editor_open: false,
                entries: self.entries.clone(),
                regions: self.regions.clone(),
                strictness: self.strictness,
            }),
            Action::SetStrictness(strictness) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: self.regions.clone(),
                strictness,
            }),
            Action::EnableRegion(region) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: self.regions.push(region),
                strictness: self.strictness,
            }),
            Action::DisableRegion(region) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: self.regions.retain(|r| r != &region),
                strictness: self.strictness,
            }),
            Action::SelectRegions(SelectRegions::Recommended) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: Region::dat_without_kanto().names().into(),
                strictness: self.strictness,
            }),
            Action::SelectRegions(SelectRegions::All) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: Region::dat().names().into(),
                strictness: self.strictness,
            }),
            Action::SelectRegions(SelectRegions::None) => Rc::new(Self {
                mobile_editor_open: self.mobile_editor_open,
                entries: self.entries.clone(),
                regions: MySet::default(),
                strictness: self.strictness,
            }),
        }
    }
}

#[derive(Debug, Copy, Clone, ImplicitClone, PartialEq)]
pub enum SelectRegions {
    Recommended,
    All,
    None,
}
