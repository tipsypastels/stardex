use self::parse::Parser;
use implicit_clone::{
    unsync::{IArray, IString},
    ImplicitClone,
};

mod entry;
mod parse;

#[derive(Debug, Clone, ImplicitClone)]
pub struct Entry {
    pub name: IString,
    pub custom: Option<IArray<IString>>,
    pub filler: bool,
    pub ignore: bool,
}

pub fn entries(s: &str) {
    // let mut entries = Vec::new();

    for line in s.lines() {
        let line = line.trim();

        if line.is_empty() || line.starts_with('#') {
            continue;
        }

        let parser = Parser::new(line);
    }
}
