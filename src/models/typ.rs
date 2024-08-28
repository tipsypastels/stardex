use super::{dat, Name};
use crate::collections::MyArray;
use implicit_clone::{unsync::IString, ImplicitClone};
use serde::Deserialize;

dat!(static DAT<MyArray<Type>, TypeDatValue> in "type.toml");

#[derive(Debug, Clone, ImplicitClone, PartialEq, Eq, Hash)]
pub struct Type {
    pub name: IString,
    pub icon: IString,
    pub color: IString,
}

impl Type {
    pub fn dat() -> MyArray<Self> {
        DAT.get()
    }

    pub fn custom(name: IString) -> Self {
        Self {
            name,
            icon: "question-circle".into(),
            color: "#ff0000".into(), // TODO
        }
    }
}

impl Name for Type {
    fn name(&self) -> &IString {
        &self.name
    }
}

#[derive(Deserialize)]
struct TypeDatValue {
    color: IString,
    icon: IString,
}

impl TypeDatValue {
    fn map_dat(name: IString, Self { color, icon }: Self) -> Type {
        Type { name, color, icon }
    }
}
