import {
    Token,
    CommandResult,
    GetCommandsResult,
    CommandParser,
    Command,
    WorldType,
    call_with_early_stopping
} from './commands'

import {capitalize, tokenize, untokenize, random_choice} from './text_tools';


export class BirdWorld implements WorldType{
    readonly is_in_heaven: boolean;

    constructor(is_in_heaven: boolean = false) {
        this.is_in_heaven = is_in_heaven;
    }

    update(is_in_heaven: boolean = false) {
        return new BirdWorld(is_in_heaven);
    }

    get_commands(): GetCommandsResult<this>{
        let commands: Command<BirdWorld>[] = [];
        let disabled_commands: Command<BirdWorld>[] = [];
        commands.push(go_cmd);
        if (this.is_in_heaven) {
            commands.push(mispronounce_cmd);
        } else {
            disabled_commands.push(mispronounce_cmd);
        }
        return <GetCommandsResult<this>> {commands, disabled_commands};
    }

    interstitial_update() {
        return {message: (this.is_in_heaven)
            ? "You're in Heaven. There's a bird up here. His name is Zarathustra. He is ugly."
            : "You're standing around on the earth."
        };
    }
}

const go_cmd: Command<BirdWorld> = {
    command_name: ['go'],
    execute: call_with_early_stopping(
        function*(world: BirdWorld, parser: CommandParser){
            let dir_options: Token[][] = [];
            let disabled_options: Token[][] = [];
            if (world.is_in_heaven) {
                dir_options.push(['down']);
                disabled_options.push(['up']);
            } else {
                dir_options.push(['up']);
                disabled_options.push(['down']);
            }
            
            let dir_word = yield parser.consume_option(dir_options, undefined, undefined, disabled_options);
            yield parser.done();

            let new_world = world.update(!world.is_in_heaven);
            let message = capitalize(dir_word) + ' you go.';

            return {world: new_world, message: message};
        }
    )
}

const mispronounce_cmd: Command<BirdWorld> = {
    command_name: ['mispronounce'],
    execute: call_with_early_stopping(
        function*(world: BirdWorld, parser: CommandParser) {
            let specifier_word = yield parser.consume_option([["zarathustra's"]]);
            
            yield parser.consume_filler(['name']);

            let utterance_options = [
                'Zammersretter',
                'Hoosterzaro',
                'Rooster Thooster',
                'Thester Zar',
                'Zerthes Threstine'
            ]

            let message = `"${random_choice(utterance_options)}," you say.`;

            return {world, message};
        }
    )
}



