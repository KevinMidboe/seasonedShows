#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-
# @Author: KevinMidboe
# @Date:   2017-08-25 23:22:27
# @Last Modified by:   KevinMidboe
# @Last Modified time: 2017-10-12 22:44:27

from guessit import guessit
import os, errno
import logging
import tvdb_api
from pprint import pprint

import env_variables as env

from video import VIDEO_EXTENSIONS, Episode, Movie, Video
from subtitle import SUBTITLE_EXTENSIONS, Subtitle, get_subtitle_path
from utils import sanitize

logging.basicConfig(filename=os.path.dirname(__file__) + '/' + env.logfile, level=logging.INFO)

from datetime import datetime

#: Supported archive extensions
ARCHIVE_EXTENSIONS = ('.rar',)

def scan_video(path):
    """Scan a video from a `path`.

    :param str path: existing path to the video.
    :return: the scanned video.
    :rtype: :class:`~subliminal.video.Video`

    """
    # check for non-existing path
    if not os.path.exists(path):
        raise ValueError('Path does not exist')

    # check video extension
    # if not path.endswith(VIDEO_EXTENSIONS):
    #     raise ValueError('%r is not a valid video extension' % os.path.splitext(path)[1])

    dirpath, filename = os.path.split(path)
    logging.info('Scanning video %r in %r', filename, dirpath)

    # guess
    parent_path = path.strip(filename)
    # video = Video.fromguess(filename, parent_path, guessit(path))
    video = Video(filename)
    # guessit(path)

    return video


def scan_subtitle(path):
   if not os.path.exists(path):
      raise ValueError('Path does not exist')

   dirpath, filename = os.path.split(path)
   logging.info('Scanning subtitle %r in %r', filename, dirpath)

   # guess
   parent_path = path.strip(filename)
   subtitle = Subtitle.fromguess(filename, parent_path, guessit(path))


   return subtitle


def scan_files(path, age=None, archives=True):
    """Scan `path` for videos and their subtitles.

    See :func:`refine` to find additional information for the video.

    :param str path: existing directory path to scan.
    :param datetime.timedelta age: maximum age of the video or archive.
    :param bool archives: scan videos in archives.
    :return: the scanned videos.
    :rtype: list of :class:`~subliminal.video.Video`

    """
    # check for non-existing path
    if not os.path.exists(path):
        raise ValueError('Path does not exist')

    # check for non-directory path
    if not os.path.isdir(path):
        raise ValueError('Path is not a directory')

    name_dict = {}

    # walk the path
    mediafiles = []
    for dirpath, dirnames, filenames in os.walk(path):
        logging.debug('Walking directory %r', dirpath)

        # remove badly encoded and hidden dirnames
        for dirname in list(dirnames):
            if dirname.startswith('.'):
                logging.debug('Skipping hidden dirname %r in %r', dirname, dirpath)
                dirnames.remove(dirname)

        # scan for videos
        for filename in filenames:
            # filter on videos and archives
            if not (filename.endswith(VIDEO_EXTENSIONS) or filename.endswith(SUBTITLE_EXTENSIONS) or archives and filename.endswith(ARCHIVE_EXTENSIONS)):
                continue

            # skip hidden files
            if filename.startswith('.'):
                logging.debug('Skipping hidden filename %r in %r', filename, dirpath)
                continue

            # reconstruct the file path
            filepath = os.path.join(dirpath, filename)

            # skip links
            if os.path.islink(filepath):
                logging.debug('Skipping link %r in %r', filename, dirpath)
                continue

            # skip old files 
            if age and datetime.utcnow() - datetime.utcfromtimestamp(os.path.getmtime(filepath)) > age:
                logging.debug('Skipping old file %r in %r', filename, dirpath)
                continue

            # scan
            if filename.endswith(VIDEO_EXTENSIONS):  # video
                try:
                    video = scan_video(filepath)
                    try:
                        name_dict[video.series] += 1
                    except KeyError:
                        name_dict[video.series] = 0
                    mediafiles.append(video)

                except ValueError:  # pragma: no cover
                    logging.exception('Error scanning video')
                    continue
            elif archives and filename.endswith(ARCHIVE_EXTENSIONS):  # archive
                print('archive')
                pass
            #    try:
            #        video = scan_archive(filepath)
            #        mediafiles.append(video)
            #    except (NotRarFile, RarCannotExec, ValueError):  # pragma: no cover
            #        logging.exception('Error scanning archive')
            #        continue
            elif filename.endswith(SUBTITLE_EXTENSIONS): # subtitle
                try:
                    subtitle = scan_subtitle(filepath)
                    mediafiles.append(subtitle)
                except ValueError: 
                    logging.exception('Error scanning subtitle')
                    continue
            else:  # pragma: no cover
                raise ValueError('Unsupported file %r' % filename)


    pprint(name_dict)
    return mediafiles


def organize_files(path):
   hashList = {}
   mediafiles = scan_files(path)
   # print(mediafiles)

   for file in mediafiles:
        hashList.setdefault(file.__hash__(),[]).append(file)
         # hashList[file.__hash__()] = file

   return hashList


def save_subtitles(files, single=False, directory=None, encoding=None):
    t = tvdb_api.Tvdb()

    if not isinstance(files, list):
        files = [files]

    for file in files:
        # TODO this should not be done in the loop
        dirname = "%s S%sE%s" % (file.series, "%02d" % (file.season), "%02d" % (file.episode))

        createParentfolder = not dirname in file.parent_path
        if createParentfolder:
            dirname = os.path.join(file.parent_path, dirname)
            print('Created: %s' % dirname)
            try:
                os.makedirs(dirname)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    raise

        # TODO Clean this !
        try:
            tvdb_episode = t[file.series][file.season][file.episode]
            episode_title = tvdb_episode['episodename']
        except:
            episode_title = ''

        old = os.path.join(file.parent_path, file.name)

        if file.name.endswith(SUBTITLE_EXTENSIONS):
            lang = file.getLanguage()
            sdh = '.sdh' if file.sdh else ''
            filename = "%s S%sE%s %s%s.%s.%s" % (file.series, "%02d" % (file.season), "%02d" % (file.episode), episode_title, sdh, lang, file.container)
        else:
            filename = "%s S%sE%s %s.%s" % (file.series, "%02d" % (file.season), "%02d" % (file.episode), episode_title, file.container)

        if createParentfolder:
            newname = os.path.join(dirname, filename)
        else:
            newname = os.path.join(file.parent_path, filename)

        
        print('Moved: %s ---> %s' % (old, newname))
        os.rename(old, newname)

        print()


    # for hash in files:
    #   hashIndex = [files[hash]]
    #   for hashItems in hashIndex:
    #      for file in hashItems:
    #         print(file.series)

    # saved_subtitles = []
    # for subtitle in files:
    #     # check content
    #     if subtitle.name is None:
    #         logging.error('Skipping subtitle %r: no content', subtitle)
    #         continue

    #     # check language
    #     if subtitle.language in set(s.language for s in saved_subtitles):
    #         logging.debug('Skipping subtitle %r: language already saved', subtitle)
    #         continue

    #     # create subtitle path
    #     subtitle_path = get_subtitle_path(video.name, None if single else subtitle.language)
    #     if directory is not None:
    #         subtitle_path = os.path.join(directory, os.path.split(subtitle_path)[1])

    #     # save content as is or in the specified encoding
    #     logging.info('Saving %r to %r', subtitle, subtitle_path)
    #     if encoding is None:
    #         with io.open(subtitle_path, 'wb') as f:
    #             f.write(subtitle.content)
    #     else:
    #         with io.open(subtitle_path, 'w', encoding=encoding) as f:
    #             f.write(subtitle.text)
    #     saved_subtitles.append(subtitle)

    #     # check single
    #     if single:
    #         break

    # return saved_subtitles

def stringTime():
    return str(datetime.now().strftime("%Y-%m-%d %H:%M:%S:%f"))


def main():
    # episodePath = '/Volumes/media/tv/Black Mirror/Black Mirror Season 01/'
    episodePath = '/Volumes/mainframe/shows/Black Mirror/Black Mirror Season 01/'

    t = tvdb_api.Tvdb()

    hashList = organize_files(episodePath)
    pprint(hashList)



if __name__ == '__main__':
    main()
