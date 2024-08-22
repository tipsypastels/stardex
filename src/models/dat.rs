use std::{cell::RefCell, thread::LocalKey};

macro_rules! dat {
    (static $static:ident<$storage_ty:ty, $value_ty:ty> in $file:literal) => {
        pub static $static: crate::models::dat::Dat<$storage_ty> = {
            use crate::models::dat::Dat;
            use ahash::RandomState;
            use implicit_clone::unsync::IString;
            use indexmap::IndexMap;
            use std::cell::RefCell;

            const TXT: &'static str = include_str!(concat!("../../dat/", $file));

            thread_local! {
                static KEY: RefCell<Option<$storage_ty>> = const { RefCell::new(None) }
            }

            Dat {
                __key: &KEY,
                __new: || {
                    toml::from_str::<IndexMap<IString, $value_ty, RandomState>>(TXT)
                        .expect(concat!("invalid ", $file))
                        .into_iter()
                        .map(|(k, v)| <$value_ty>::map_dat(k, v))
                        .collect()
                },
            }
        };
    };
}

pub(crate) use dat;

pub struct Dat<S: 'static> {
    pub __key: &'static LocalKey<RefCell<Option<S>>>,
    pub __new: fn() -> S,
}

impl<S: Clone + 'static> Dat<S> {
    pub fn get(&'static self) -> S {
        self.__key.with(|cell| {
            let mut cell = cell.borrow_mut();

            if let Some(s) = cell.as_ref() {
                return s.clone();
            }

            let s = (self.__new)();
            *cell = Some(s.clone());
            s
        })
    }
}
