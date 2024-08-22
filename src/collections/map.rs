use super::MyArray;
use implicit_clone::{
    unsync::{IMap, IString},
    ImplicitClone,
};
use serde::{Deserialize, Serialize};
use std::hash::Hash;

#[derive(Debug, Deserialize, Serialize, Clone, ImplicitClone, PartialEq)]
pub struct MyMap<K, V>(IMap<K, V>)
where
    K: ImplicitClone + Eq + Hash + 'static,
    V: ImplicitClone + PartialEq + 'static;

impl<K, V> MyMap<K, V>
where
    K: ImplicitClone + Eq + Hash + 'static,
    V: ImplicitClone + PartialEq + 'static,
{
    pub fn iter(&self) -> impl Iterator<Item = (K, V)> + '_ {
        self.0.iter()
    }

    pub fn retain(&self, f: impl Fn(&K, &V) -> bool) -> Self {
        Self(self.0.iter().filter(|(k, v)| f(k, v)).collect())
    }
}

// TODO: Case insensitive hash map.
impl<V> MyMap<IString, V>
where
    V: ImplicitClone + PartialEq + 'static,
{
    pub fn names(&self) -> MyArray<IString> {
        self.0.keys().collect()
    }

    pub fn named(&self, name: &str) -> Option<V> {
        self.0.get(name)
    }

    pub fn named_array(&self, names: MyArray<IString>) -> Option<MyArray<V>> {
        names.iter().map(|name| self.named(&name)).collect()
    }
}

impl<K, V> FromIterator<(K, V)> for MyMap<K, V>
where
    K: ImplicitClone + Eq + Hash + 'static,
    V: ImplicitClone + PartialEq + 'static,
{
    fn from_iter<I: IntoIterator<Item = (K, V)>>(iter: I) -> Self {
        Self(IMap::<K, V>::from_iter(iter))
    }
}

impl<K, V> Default for MyMap<K, V>
where
    K: ImplicitClone + Eq + Hash + 'static,
    V: ImplicitClone + PartialEq + 'static,
{
    fn default() -> Self {
        Self(Default::default())
    }
}
