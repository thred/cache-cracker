export class Scanner {
    private pos: number;
    private _offset: number;
    private _line: number;
    private _column: number;
    private ch: string;
    private nextCh: string;
    private skipLF: boolean = false;
    private initialized: boolean = false;
    private closed: boolean = false;
    private lookedAhead: boolean = false;

    constructor(private source: string, private _startOffset: number = 0, private _startLine: number = 1, private _startColumn: number = 1) {
    }

    reset(): void {
        this.initialized = false;
    }

    get offset() {
        return this._offset;
    }

    get line() {
        return this._line;
    }

    get column() {
        return this._column;
    }

    get(accept?: (ch: string) => boolean): string {
        if (!this.initialized) {
            this.next(accept);
        }

        if (!this.ch) {
            return null;
        }

        if (!accept) {
            return this.ch;
        }

        if (accept(this.ch)) {
            return this.ch;
        }

        return this.next(accept);
    }

    next(accept?: (ch: string) => boolean): string {
        while (true) {
            if (this.closed) {
                return null;
            }

            if ((this.initialized) && (this.ch === "\n")) {
                this._line += 1;
                this._column = 0;
            }

            if ((this.initialized) && (this.lookedAhead)) {
                this.ch = this.nextCh;
                this.lookedAhead = false;
            }
            else {
                this.ch = this.read();
            }

            this._offset = this.pos;
            this._column += 1;

            if (!this.ch) {
                this.closed = true;

                break;
            }

            if (!accept) {
                break;
            }

            if (accept(this.ch)) {
                break;
            }
        }

        // console.log(`[Off ${this.offset}, Ln ${this.line}, Col ${this.column}] "${this.ch}" (${(this.ch) ? this.ch.charCodeAt(0) : -1})`)

        return this.ch;
    }

    lookAhead(): string {
        if (this.lookedAhead) {
            return this.nextCh;
        }

        this.nextCh = this.read();
        this.lookedAhead = true;

        return this.nextCh;
    }

    private read(): string {
        if (!this.initialized) {
            this.pos = this._offset = this._startOffset;
            this._line = this._startLine;
            this._column = this._startColumn - 1;
            this.ch = null;
            this.nextCh = null;
            this.skipLF = false;
            this.initialized = true;
            this.closed = false;
            this.lookedAhead = false;
        }
        else {
            this.pos++;
        }

        if (this.pos >= this.source.length) {
            return null;
        }

        let ch = this.source.charAt(this.pos);

        if ((ch === "\n") && (this.skipLF)) {
            this.pos++;

            if (this.pos >= this.source.length) {
                return null;
            }

            ch = this.source.charAt(this.pos);
        }

        this.skipLF = false;

        if (ch === "\r") {
            ch = "\n";

            this.skipLF = true;
        }

        return ch;
    }
}