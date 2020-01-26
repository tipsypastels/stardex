export function capitalize(input: string): string {
  return input[0].toUpperCase() + input.slice(1).toLowerCase();
}

export function camelCase(input: string): string {
  return toWords(input).replace(/\s./g, match => {
    return match[match.length - 1].toUpperCase();
  });
}

export function upperCamelCase(input: string): string {
  return input[0].toUpperCase() + camelCase(input.slice(1));
}

export function underScore(input: string): string {
  return toWords(input).replace(/\s/g, '_').toLowerCase();
}

export function kebabCase(input: string): string {
  return toWords(input).replace(/\s/g, '-').toLowerCase();
}

export function toWords(input: string): string {
  return input.replace(/[\s-_A-Z]/g, match => {
    if (/^[A-Z]$/.exec(match)) {
      return ` ${match.toLowerCase()}`;
    } else {
      return ' ';
    }
  });
}

export function extractCapitalization(input: string): boolean[] {
  const bools: boolean[] = [];

  for (let i = 0; i < input.length; i++) {
    bools[i] = input[i] === input[i].toUpperCase();
  }

  return bools;
}

export function setCapitalization(input: string, caps: boolean[]): string {
  if (caps.every(e => e)) {
    return input.toUpperCase();
  }

  let output = input.split('');

  for (let i = 0; i < caps.slice(0, input.length).length; i++) {
    if (caps[i]) {
      output[i] = output[i].toUpperCase();
    } else {
      output[i] = output[i].toLowerCase();
    }
  }

  return output.join('');
}

export function replaceWithMatchingCapitalization(input: string, from: string, to: string): string {
  return input.replace(new RegExp(`(${from})`, 'i'), replaced => {
    const cap = extractCapitalization(replaced);
    return setCapitalization(to, cap);
  });
}