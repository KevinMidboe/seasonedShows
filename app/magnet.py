#!/usr/bin/env python
'''
Created on Apr 19, 2012
@author: dan, Faless

    GNU GENERAL PUBLIC LICENSE - Version 3

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    http://www.gnu.org/licenses/gpl-3.0.txt

'''

import shutil
import tempfile
import os.path as pt
import sys, logging
import libtorrent as lt
from time import sleep

import env_variables as env

logging.basicConfig(filename=pt.dirname(__file__) + '/' + env.logfile)

def magnet2torrent(magnet, output_name=None):
    if output_name and \
            not pt.isdir(output_name) and \
            not pt.isdir(pt.dirname(pt.abspath(output_name))):
        logging.info("Invalid output folder: " + pt.dirname(pt.abspath(output_name)))
        logging.info("")
        sys.exit(0)

    tempdir = tempfile.mkdtemp()
    ses = lt.session()
    params = {
        'save_path': tempdir,
        'storage_mode': lt.storage_mode_t(2),
        'paused': False,
        'auto_managed': True,
        'duplicate_is_error': True
    }
    handle = lt.add_magnet_uri(ses, magnet, params)

    logging.info("Downloading Metadata (this may take a while)")
    while (not handle.has_metadata()):
        try:
            sleep(1)
        except KeyboardInterrupt:
            logging.info("Aborting...")
            ses.pause()
            logging.info("Cleanup dir " + tempdir)
            shutil.rmtree(tempdir)
            sys.exit(0)
    ses.pause()
    logging.info("Done")

    torinfo = handle.get_torrent_info()
    torfile = lt.create_torrent(torinfo)

    output = pt.abspath(torinfo.name() + ".torrent")

    if output_name:
        if pt.isdir(output_name):
            output = pt.abspath(pt.join(
                output_name, torinfo.name() + ".torrent"))
        elif pt.isdir(pt.dirname(pt.abspath(output_name))):
            output = pt.abspath(output_name)

    logging.info("Saving torrent file here : " + output + " ...")
    torcontent = lt.bencode(torfile.generate())
    f = open(output, "wb")
    f.write(lt.bencode(torfile.generate()))
    f.close()
    logging.info("Saved! Cleaning up dir: " + tempdir)
    ses.remove_torrent(handle)
    shutil.rmtree(tempdir)

    return output

def main():
    magnet = sys.argv[1]
    logging.info('INPUT: {}'.format(magnet))

    magnet2torrent(magnet, env.torrent_dumpsite)


if __name__ == "__main__":
    main()
