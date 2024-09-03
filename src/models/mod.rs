use self::dat::dat;
use implicit_clone::unsync::IString;

#[cfg(test)]
mod tests;

mod allotment;
mod breakdown;
mod dat;
mod entry;
mod pokemon;
mod region;
mod strictness;
mod typ;

pub use allotment::{AllotedType, Allotment};
pub use breakdown::{Breakdown, BreakdownAction, BreakdownType};
pub use entry::{Entry, EntryError};
pub use pokemon::Pokemon;
pub use region::Region;
pub use strictness::Strictness;
pub use typ::Type;

pub trait Name {
    fn name(&self) -> &IString;
}
