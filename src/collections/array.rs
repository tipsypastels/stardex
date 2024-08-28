use crate::models::Name;
use implicit_clone::{
    unsync::{IArray, IString},
    ImplicitClone,
};
use serde::{Deserialize, Serialize};
use std::{
    hash::{Hash, Hasher},
    ops::Deref,
};

use super::MySet;

#[derive(Debug, Deserialize, Serialize, Clone, ImplicitClone, PartialEq, Eq)]
pub struct MyArray<T>(IArray<T>)
where
    T: ImplicitClone + 'static;

impl<T> MyArray<T>
where
    T: ImplicitClone + 'static,
{
    pub fn iter(&self) -> impl Iterator<Item = T> + '_ {
        self.0.iter()
    }

    pub fn retain(&self, f: impl Fn(&T) -> bool) -> Self {
        Self(self.0.iter().filter(f).collect())
    }
}

impl<T> MyArray<T>
where
    T: Name + ImplicitClone + 'static,
{
    pub fn names(&self) -> MyArray<IString> {
        self.iter().map(|t| t.name().clone()).collect()
    }

    pub fn named(&self, name: &str) -> Option<T> {
        self.0.iter().find(|t| t.name().eq_ignore_ascii_case(name))
    }

    pub fn named_array(&self, names: MyArray<IString>) -> Option<Self> {
        names.0.iter().map(|name| self.named(&name)).collect()
    }
}

impl<T> Deref for MyArray<T>
where
    T: ImplicitClone + 'static,
{
    type Target = [T];

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> FromIterator<T> for MyArray<T>
where
    T: ImplicitClone + 'static,
{
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        Self(IArray::<T>::from_iter(iter))
    }
}

impl<T> From<MySet<T>> for MyArray<T>
where
    T: ImplicitClone + Eq + Hash + 'static,
{
    fn from(set: MySet<T>) -> Self {
        set.iter().collect()
    }
}

impl<T> From<Vec<T>> for MyArray<T>
where
    T: ImplicitClone + 'static,
{
    fn from(vec: Vec<T>) -> Self {
        Self(IArray::<T>::from(vec))
    }
}

impl<T> Hash for MyArray<T>
where
    T: Hash + ImplicitClone + 'static,
{
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.hash(state);
    }
}

impl<T> Default for MyArray<T>
where
    T: ImplicitClone + 'static,
{
    fn default() -> Self {
        Self(Default::default())
    }
}
