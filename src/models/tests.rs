use super::*;

#[test]
fn type_basic_lookup() {
    assert!(Type::dat().named("Fire").is_some());
    assert!(Type::dat().named("Unknown").is_none());
}

#[test]
fn type_ignore_case_lookup() {
    assert!(Type::dat().named("fire").is_some());
    assert!(Type::dat().named("fIRE").is_some());
}
