use super::{AllotedType, Allotment, Strictness, Type};
use crate::collections::MyArray;
use ahash::AHashSet;
use implicit_clone::ImplicitClone;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct Breakdown {
    types: MyArray<BreakdownType>,
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct BreakdownType {
    pub typ: Type,
    pub own_ratio: f64,
    pub against_ratio: f64,
    pub action: Option<BreakdownAction>,
}

#[derive(Debug, Copy, Clone, ImplicitClone, PartialEq)]
pub enum BreakdownAction {
    Add,
    Remove,
}

impl Breakdown {
    pub fn new(own: &Allotment, against: &Allotment, strictness: Strictness) -> Self {
        let mut vec = Vec::<BreakdownType>::new();
        let max_diff = strictness.maximum_ratio_difference();

        let own = list_with_empties_sorted_by_type_name(own);
        let against = list_with_empties_sorted_by_type_name(against);

        for (own_type, against_type) in own.iter().zip(against.iter()) {
            let own_ratio = own_type.ratio;
            let against_ratio = against_type.ratio;

            let action = if own_ratio - against_ratio > max_diff {
                Some(BreakdownAction::Remove)
            } else if against_ratio - own_ratio > max_diff {
                Some(BreakdownAction::Add)
            } else {
                None
            };

            vec.push(BreakdownType {
                typ: own_type.typ,
                own_ratio,
                against_ratio,
                action,
            });
        }

        Self { types: vec.into() }
    }

    pub fn iter(&self) -> impl Iterator<Item = BreakdownType> + '_ {
        self.types.iter()
    }
}

fn list_with_empties_sorted_by_type_name(a: &Allotment) -> MyArray<AllotedType> {
    let mut vec = Vec::<AllotedType>::new();
    let mut unused_types = Type::dat().iter().collect::<AHashSet<_>>();

    for alloted_type in a.iter() {
        unused_types.remove(&alloted_type.typ);
        vec.push(alloted_type);
    }

    for typ in unused_types {
        vec.push(AllotedType {
            typ,
            count: 0,
            ratio: 0.0,
        })
    }

    vec.sort_unstable_by(|a, b| a.typ.name.cmp(&b.typ.name));
    vec.into()
}
