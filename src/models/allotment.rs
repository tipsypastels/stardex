use super::{Entry, Type};
use crate::collections::MyArray;
use ahash::AHashMap;
use implicit_clone::ImplicitClone;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct Allotment {
    pub total: u32,
    pub types: MyArray<(Type, u32)>,
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct AllotedType {
    pub typ: Type,
    pub count: u32,
    pub percent: u32,
}

impl Allotment {
    pub fn new(entries: impl IntoIterator<Item = Entry>) -> Self {
        let mut total = 0u32;
        let mut map = AHashMap::<Type, u32>::new();

        for entry in entries {
            if entry.ignore {
                continue;
            }

            for typ in entry.types.iter() {
                total += 1;
                map.entry(typ).and_modify(|c| *c += 1).or_insert(1);
            }
        }

        let types = map.into_iter().collect();
        Self { total, types }
    }

    pub fn iter(&self) -> impl Iterator<Item = AllotedType> + '_ {
        self.types.iter().map(|(typ, count)| AllotedType {
            typ,
            count,
            percent: count / self.total * 100,
        })
    }
}
