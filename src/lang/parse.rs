use std::result;

#[derive(Debug)]
pub struct Parser<'a> {
    s: &'a str,
}

impl<'a> Parser<'a> {
    pub fn new(s: &'a str) -> Self {
        Self { s }
    }

    fn whitespace(&mut self) {
        self.eat(b' ')
    }

    fn eat(&mut self, byte: u8) {
        while self.peek() == Some(byte) {
            self.next();
        }
    }

    fn next(&mut self) -> Option<u8> {
        let next = self.peek()?;
        self.s = self.s.get(1..)?;
        Some(next)
    }

    fn peek(&self) -> Option<u8> {
        self.s.bytes().next()
    }
}

pub type Result<T> = result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {}
