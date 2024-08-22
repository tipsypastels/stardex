use super::{dat, Name, Type};
use crate::collections::{MyArray, MyMap};
use implicit_clone::{unsync::IString, ImplicitClone};
use serde::Deserialize;

dat!(static DAT<MyMap<IString, Pokemon>, PokemonDatValue> in "pokemon.toml");

#[derive(Debug, Clone, ImplicitClone, PartialEq, Eq, Hash)]
pub struct Pokemon {
    pub name: IString,
    pub types: MyArray<Type>,
}

impl Pokemon {
    pub fn dat() -> MyMap<IString, Self> {
        DAT.get()
    }
}

impl Name for Pokemon {
    fn name(&self) -> &IString {
        &self.name
    }
}

#[derive(Deserialize)]
struct PokemonDatValue {
    types: MyArray<IString>,
}

impl PokemonDatValue {
    fn map_dat(name: IString, Self { types }: Self) -> (IString, Pokemon) {
        (
            name.clone(),
            Pokemon {
                name,
                types: Type::dat().named_array(types).unwrap(),
            },
        )
    }
}
