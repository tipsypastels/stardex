use super::{dat, Name, Pokemon};
use crate::collections::MyArray;
use implicit_clone::{unsync::IString, ImplicitClone};
use serde::Deserialize;

dat!(static DAT<MyArray<Region>, RegionDatValue> in "region.toml");

#[derive(Debug, Clone, ImplicitClone, PartialEq, Eq, Hash)]
pub struct Region {
    pub name: IString,
    pub icon: IString,
    pub pokemon: MyArray<Pokemon>,
}

impl Region {
    pub fn dat() -> MyArray<Self> {
        DAT.get()
    }

    pub fn dat_without_kanto() -> MyArray<Self> {
        Self::dat().retain(|r| r.name != "Kanto")
    }
}

impl Name for Region {
    fn name(&self) -> &IString {
        &self.name
    }
}

#[derive(Deserialize)]
struct RegionDatValue {
    icon: IString,
    pokemon: MyArray<IString>,
}

impl RegionDatValue {
    fn map_dat(name: IString, Self { icon, pokemon }: Self) -> Region {
        Region {
            name,
            icon,
            pokemon: Pokemon::dat().named_array(pokemon).unwrap(),
        }
    }
}
