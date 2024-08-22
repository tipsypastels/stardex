use implicit_clone::{unsync::IMap, ImplicitClone};
use serde::{Deserialize, Serialize};
use std::{borrow::Borrow, hash::Hash, iter::once};

use super::MyArray;

#[derive(Debug, Deserialize, Serialize, Clone, ImplicitClone, PartialEq)]
pub struct MySet<T>(IMap<T, ()>)
where
    T: ImplicitClone + Eq + Hash + 'static;

impl<T> MySet<T>
where
    T: ImplicitClone + Eq + Hash + 'static,
{
    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn iter(&self) -> impl Iterator<Item = T> + '_ {
        self.0.iter().map(|(k, _)| k)
    }

    pub fn contains<Q>(&self, key: &Q) -> bool
    where
        T: Borrow<Q>,
        Q: Hash + Eq + ?Sized,
    {
        self.0.contains_key(key)
    }

    pub fn push(&self, value: T) -> Self {
        self.iter().chain(once(value)).collect()
    }

    pub fn map<U>(&self, f: impl Fn(T) -> U) -> MySet<U>
    where
        U: ImplicitClone + Eq + Hash + 'static,
    {
        self.0.iter().map(|(k, _)| f(k)).collect()
    }

    pub fn retain(&self, f: impl Fn(&T) -> bool) -> Self {
        Self(self.0.iter().filter(|(k, _)| f(k)).collect())
    }
}

impl<T> FromIterator<T> for MySet<T>
where
    T: ImplicitClone + Eq + Hash + 'static,
{
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        Self(IMap::<T, ()>::from_iter(iter.into_iter().map(|k| (k, ()))))
    }
}

impl<T> From<MyArray<T>> for MySet<T>
where
    T: ImplicitClone + Eq + Hash + 'static,
{
    fn from(array: MyArray<T>) -> Self {
        array.iter().collect()
    }
}

impl<T> Default for MySet<T>
where
    T: ImplicitClone + Eq + Hash + 'static,
{
    fn default() -> Self {
        Self(Default::default())
    }
}
