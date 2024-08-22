// use implicit_clone::unsync::{IArray, IString};
// use nom::{
//     branch::alt,
//     bytes::complete::{tag, take_until1},
//     character::complete::multispace0,
//     combinator::value,
//     IResult,
// };

// #[derive(Debug)]
// pub struct Entry {
//     pub name: IString,
//     pub custom: Option<IArray<IString>>,
//     pub filler: bool,
//     pub ignore: bool,
// }

// // pub fn parse(line: &str) -> Result<Entry, IString> {}

// fn parse_line(s: &str) -> IResult<&str, Entry> {
//     let (mut s, name) = take_until1("@")(s)?;
//     let name: IString = name.to_string().into();
//     let mut custom: Option<IArray<IString>> = None;
//     let mut filler = false;
//     let mut ignore = false;

//     while !s.is_empty() {
//         (s, _) = multispace0(s)?;

//         let (s2, attr) = alt((parse_filler, parse_ignore))(s)?;
//         match attr {
//             ParsedAttr::Filler => {
//                 filler = true;
//             }
//             ParsedAttr::Ignore => {
//                 ignore = true;
//             }
//         }
//         s = s2;
//     }

//     let entry = Entry {
//         name,
//         custom,
//         filler,
//         ignore,
//     };

//     Ok((s, entry))
// }

// #[derive(Debug, Copy, Clone)]
// enum ParsedAttr {
//     Filler,
//     Ignore,
// }

// fn parse_custom(s: &str) -> IResult<&str, ParsedAttr> {
//     value(ParsedAttr::Filler, tag("@filler"))(s)
// }

// fn parse_filler(s: &str) -> IResult<&str, ParsedAttr> {
//     value(ParsedAttr::Filler, tag("@filler"))(s)
// }

// fn parse_ignore(s: &str) -> IResult<&str, ParsedAttr> {
//     value(ParsedAttr::Ignore, tag("@ignore"))(s)
// }
