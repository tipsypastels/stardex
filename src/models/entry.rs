use super::Name;
use implicit_clone::{unsync::IString, ImplicitClone};

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct Entry {}

impl Name for Entry {
    fn name(&self) -> &IString {
        todo!()
    }
}
