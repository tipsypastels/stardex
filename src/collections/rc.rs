use implicit_clone::ImplicitClone;
use std::{ops::Deref, rc::Rc};
use yew::html::IntoPropValue;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub enum MaybeRc<T> {
    Rc(Rc<T>),
    Owned(T),
}

impl<T> Deref for MaybeRc<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        match self {
            Self::Rc(rc) => rc,
            Self::Owned(value) => value,
        }
    }
}

impl<T> From<Rc<T>> for MaybeRc<T> {
    fn from(rc: Rc<T>) -> Self {
        Self::Rc(rc)
    }
}

impl<T> From<T> for MaybeRc<T> {
    fn from(value: T) -> Self {
        Self::Owned(value)
    }
}

// Can't do the same for owned, that's a blanket impl.
impl<T> IntoPropValue<MaybeRc<T>> for Rc<T> {
    fn into_prop_value(self) -> MaybeRc<T> {
        self.into()
    }
}
