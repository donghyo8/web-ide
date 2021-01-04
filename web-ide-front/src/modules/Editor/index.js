import React from 'react';
/* import cParser from './parser/c';
import cppParser from './parser/cpp';
import javaParser from './parser/java' */

import './Editor.scss';

 function string_splice(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function safe_tags_replace(str) {
    const tagsToReplace = {
        ' ': '\u00A0',
    };
    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    return str.replace(/[&<> ]/g, replaceTag);
}

function countBrace(code) {
    let brace = 0;
    for(let i = 0 ; i < code.length; i++) {
        if(code[i] === '{') brace++;
        else if(code[i] === '}' && brace > 0) brace--;
    }
    return brace;
}

function autoIndent(event, text, selectionEnd) {
    /* brace 를 통한 indent 처리 */
    if( text[selectionEnd - 1] === '\n' && event.nativeEvent.inputType !== 'deleteContentBackward') {
        const braceINDENT = INDENT.repeat(countBrace(text.substr(0, selectionEnd - 1)));
        text = string_splice.bind(text)(selectionEnd, 0, braceINDENT);
    } else if( text[selectionEnd - 1] === '}' ) {
        for(let i = 1 ; i <= INDENT.length; i++) {
            if(text[selectionEnd - i - 1] === INDENT[INDENT.length - i]) {
                text = string_splice.bind(text)(selectionEnd - i - 1, 1, "");
            }
        }
    }

    return text;
}

const INDENT = "    ";

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: props.text ? props.text : "",
            parsedText: [],
            length: 20,
            debug: props.debug,
            selectionStart: 0,
            selectionEnd: 0,
            left: 0, top: 0
        }
    }

    componentDidUpdate({text}, prevState) {
        if(text !== this.props.text) {
            this.setState({
                text: this.props.text, 
                selectionStart: this.props.text.length - 1, 
                selectionEnd: this.props.text.length - 1
            }, () => {
                this.setHTMLtag();
            });
        }
        if(prevState.text !== this.state.text) {
            this.setHTMLtag();
        }
    }

    onChangeText(event) {
        let {value: text, selectionStart, selectionEnd} = event.target;
        text = autoIndent(event, text, selectionEnd);

        this.setState({text, selectionStart, selectionEnd});

        this.props.onChange(text);
    }

    onKeyDown(event) {
        const { selectionStart, selectionEnd } = event.target;

        const { keyCode } = event;
        switch(keyCode) {
            case 9:
                event.preventDefault();
                const {text}  = this.state;
                this.setState({ text: string_splice.bind(text)(selectionStart, selectionEnd - selectionStart, INDENT) });
                break;
            default:
        }
    }

    onKeyUp(event) {
        this.setCursorPosition();
    }

    inputRef = React.createRef();
    realInputRef = React.createRef();
    cursorRef = React.createRef();
    setHTMLtag() {
        let { text, parsedText } = this.state;
        const length = text.split("\n").length;
        let result = [];
        /* try {
            switch(this.props.parser) {
                case 'c':
                    result = cParser(text);
                    break;
                case 'cpp':
                    result = cppParser(text);
                    break;
                case 'java':
                    result = javaParser(text);
                    break;
                default: break;
            }
            
        } catch(e) {} */

        let readLineLength = 0;
        parsedText = text.split("\n").map((line, idx) => {
            let tag = (<p className="LINE" data-start={`${readLineLength}`} key={`line-idx-${idx}`}>{'\u200B'}</p>);
            if(line.length) {
                const tags = [];
                const lineParsed = result.filter(e=> readLineLength <= e.index && e.index < readLineLength + line.length).map(e=>{
                    e.index -= readLineLength;
                    return e;
                });

                let startIndex = 0;
                tags.push(<span data-start={readLineLength + startIndex}>{safe_tags_replace(line.slice(startIndex, lineParsed[0].index))}</span>);
                startIndex = lineParsed[0].index;

                for(let i = 0 ; i < lineParsed.length; i++) {
                    tags.push(<span data-start={readLineLength + startIndex}>{safe_tags_replace(line.slice(startIndex, lineParsed[i].index))}</span>);
                    tags.push(<span data-start={readLineLength + startIndex}>{safe_tags_replace(line.slice(lineParsed[i].index, lineParsed[i].index + lineParsed[i].token.length))}</span>);
                    startIndex = lineParsed[i].index + lineParsed[i].token.length;
                }
                tags.push(<span data-start={readLineLength + startIndex}>{safe_tags_replace(line.slice(startIndex, line.length))}</span>);

                tag = (<p className="LINE" data-start={`${readLineLength}`} key={`line-idx-${idx}`}>{tags}</p>);
            }
            // 한 줄 수 + newline
            readLineLength += (line.length + 1);
            return tag;
        });

        this.setState({parsedText, length: length < 20 ? 20 : length});//, ()=>{this.setCursorPosition();});
    }

    onClickEditor() {
        this.realInputRef.current.focus();
    }
    
    onClickText() {
        const { anchorOffset, focusOffset, anchorNode} = window.getSelection();
        const startIndex = Number(anchorNode.parentNode.dataset.start);

        const selectionStart = (focusOffset > anchorOffset ? anchorOffset : focusOffset) + startIndex;
        const selectionEnd = (focusOffset > anchorOffset ? focusOffset : anchorOffset) + startIndex;

        this.realInputRef.current.setSelectionRange( selectionStart, selectionEnd );
        this.setCursorPosition();
    }

    setCursorPosition() {
        const { selectionStart, selectionEnd } = this.realInputRef.current;
        console.log("position", selectionStart, selectionEnd);

        this.inputRef.current.childNodes.forEach((node) => {
            const start = Number(node.dataset.start);
            if(!(start <= selectionEnd && start + node.innerText.length >= selectionEnd )) { return; }

            const range = document.createRange();
            range.setStart(node.childNodes[0], selectionEnd - start);
            range.setEnd(node.childNodes[0], selectionEnd - start);

            const [rect] = range.getClientRects();
            
            if(!rect) return; 
            const boundary = this.inputRef.current.getBoundingClientRect();
            this.setState({left: rect.left - boundary.left, top: rect.top - boundary.top});
        });
    }

    renderLines() {
        const lengthDOMs = [];
        for(let i = 0 ; i < this.state.length; i++) {
            lengthDOMs.push(
                <li key={`editor-line-${i}`}>{i+1}</li>
            )
        }
        return (
            <ul className="line-area">
                {lengthDOMs}
            </ul>
        )
    }

    render() {
        return (
            <div className={'EDITOR ' + this.props.className}>
                <textarea className="real-input-area" value={this.state.text} onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)}
                autoCapitalize="false" autoComplete="false" autoCorrect="false" ref={this.realInputRef} 
                onChange={this.onChangeText.bind(this)}></textarea>
                <div className="editor-wrapper" onClick={this.onClickEditor.bind(this)}>
                    {this.renderLines()}
                    <div className="editor-cursor-wrapper">
                        <div id="EDITAREA" className="edit-area" ref={this.inputRef} 
                            onMouseUp={this.onClickText.bind(this)}>{this.state.parsedText}</div>
                        <p className="cursor" ref={this.cursorRef} style={{left: this.state.left + "px", top: this.state.top + "px"}}></p>
                    </div>
                </div>
            </div>
        )
    }
}

Editor.defaultProps = {
    onChange: () => {}
}

export default Editor;