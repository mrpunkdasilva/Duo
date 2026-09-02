jest.mock("next/server", () => {
  class MockNextResponse extends Response {
    static json(data: unknown, init?: ResponseInit) {
      const body = JSON.stringify(data);
      return new MockNextResponse(body, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
      });
    }
  }

  class MockNextRequest {
    url: string;
    method: string;
    headers: Headers;
    private _body: unknown;
    nextUrl: { searchParams: URLSearchParams };

    constructor(input: string | URL | MockNextRequest, init?: RequestInit) {
      const urlStr = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      this.url = urlStr;
      this.method = init?.method ?? "GET";
      this.headers = new Headers(init?.headers);
      this._body = init?.body;
      this.nextUrl = { searchParams: new URL(urlStr).searchParams };
    }

    async json() {
      if (this._body && typeof this._body === "string") return JSON.parse(this._body);
      return this._body;
    }

    async text() {
      if (this._body && typeof this._body === "string") return this._body;
      return "";
    }

    clone() {
      return new MockNextRequest(this.url, {
        method: this.method,
        headers: Object.fromEntries(this.headers.entries()),
        body: this._body as BodyInit,
      });
    }
  }

  return {
    NextResponse: MockNextResponse,
    NextRequest: MockNextRequest,
  };
});

if (typeof globalThis.Request === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Request = class {
    url: string;
    method: string;
    headers: Headers;
    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method ?? "GET";
      this.headers = new Headers(init?.headers);
    }
  };
}

if (typeof globalThis.Response === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Response = class {
    status: number;
    statusText: string;
    headers: Headers;
    body: unknown;
    ok: boolean;
    constructor(body?: unknown, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? "OK";
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = new Headers(init?.headers);
    }
    async json() {
      if (typeof this.body === "string") return JSON.parse(this.body);
      return this.body;
    }
    async text() {
      return typeof this.body === "string" ? this.body : "";
    }
    clone() {
      return new (this.constructor as typeof Response)(this.body, {
        status: this.status,
        statusText: this.statusText,
      });
    }
    static json(data: unknown, init?: ResponseInit) {
      return new (this as typeof Response)(JSON.stringify(data), {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
      });
    }
  };
}

if (typeof globalThis.Headers === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.Headers = class {
    private map = new Map<string, string>();
    constructor(init?: HeadersInit) {
      if (init) {
        if (Array.isArray(init)) init.forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
        else if (init instanceof Headers) init.forEach((v, k) => this.map.set(k, v));
        else Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), String(v)));
      }
    }
    get(name: string) { return this.map.get(name.toLowerCase()) ?? null; }
    set(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
    has(name: string) { return this.map.has(name.toLowerCase()); }
    delete(name: string) { this.map.delete(name.toLowerCase()); }
    append(name: string, value: string) { this.map.set(name.toLowerCase(), (this.map.get(name.toLowerCase()) ?? "") + value); }
    forEach(cb: (value: string, key: string) => void) { this.map.forEach(cb); }
    entries() { return this.map.entries(); }
    keys() { return this.map.keys(); }
    values() { return this.map.values(); }
    [Symbol.iterator]() { return this.map[Symbol.iterator](); }
  } as any;
}
