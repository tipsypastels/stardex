use super::{Entry, Type};
use crate::collections::MyArray;
use ahash::AHashMap;
use implicit_clone::ImplicitClone;
use std::cmp::Ordering;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct Allotment {
    pub total: u32,
    pub types: MyArray<(Type, u32)>,
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct AllotedType {
    pub typ: Type,
    pub count: u32,
    pub ratio: f64,
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

        let mut vec = map.into_iter().collect::<Vec<_>>();
        vec.sort_unstable_by(sort_allotment);

        let types = vec.into();
        Self { total, types }
    }

    pub fn iter(&self) -> impl Iterator<Item = AllotedType> + '_ {
        self.types.iter().map(|(typ, count)| AllotedType {
            typ,
            count,
            ratio: count as f64 / self.total as f64,
        })
    }
}

fn sort_allotment((a_typ, a_cnt): &(Type, u32), (b_typ, b_cnt): &(Type, u32)) -> Ordering {
    b_cnt.cmp(a_cnt).then_with(|| a_typ.name.cmp(&b_typ.name))
}
