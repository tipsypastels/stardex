use super::{Pokemon, Type};
use crate::collections::MyArray;
use implicit_clone::{unsync::IString, ImplicitClone};
use std::fmt;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct Entry {
    pub name: IString,
    pub types: MyArray<Type>,
    pub filler: bool,
    pub ignore: bool,
}

impl Entry {
    pub fn new(
        name: String,
        types: Option<Vec<String>>,
        attrs: Vec<String>,
    ) -> Result<Self, EntryError> {
        let name = IString::from(name);
        let types = match (types, Pokemon::dat().named(&name)) {
            (Some(type_names), _) => type_array(type_names),
            (None, Some(pokemon)) => pokemon.types,
            (None, None) => return Err(EntryError::Unspecified(name)),
        };

        let mut filler = false;
        let mut ignore = false;

        for attr in attrs {
            match attr.as_str() {
                "@filler" => filler = true,
                "@ignore" => ignore = true,
                _ => {}
            }
        }

        Ok(Self {
            name,
            types,
            filler,
            ignore,
        })
    }
}

impl From<Pokemon> for Entry {
    fn from(pokemon: Pokemon) -> Self {
        Self {
            name: pokemon.name,
            types: pokemon.types,
            filler: false,
            ignore: false,
        }
    }
}

fn type_array(names: Vec<String>) -> MyArray<Type> {
    let dat = Type::dat();
    names
        .into_iter()
        .map(|name| {
            dat.named(&name)
                .unwrap_or_else(|| Type::custom(name.into()))
        })
        .collect()
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub enum EntryError {
    Unspecified(IString),
}

impl fmt::Display for EntryError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Unspecified(n) => write!(
                f,
                "No builtin Pokémon \"{n}\". If this is a custom Pokémon, specify its types."
            ),
        }
    }
}

impl std::error::Error for EntryError {}
