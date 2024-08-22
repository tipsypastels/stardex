use implicit_clone::ImplicitClone;
use std::fmt;

#[derive(Debug, Copy, Clone, ImplicitClone, PartialEq)]
pub enum Strictness {
    Easygoing,
    Normal,
    Strict,
    Bitchy,
}

impl Strictness {
    pub const ALL: [Self; 4] = [Self::Easygoing, Self::Normal, Self::Strict, Self::Bitchy];

    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Easygoing => "Easygoing",
            Self::Normal => "Normal",
            Self::Strict => "Strict",
            Self::Bitchy => "Bitchy",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            Self::Easygoing => "If you're just trying out Stardex.",
            Self::Normal => "If you're using Stardex as a rough guideline.",
            Self::Strict => "If you're a type balance aficionado.",
            Self::Bitchy => "If you have too much free time.",
        }
    }
}

impl fmt::Display for Strictness {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
